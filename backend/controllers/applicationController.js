import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import { uploadResume } from "../utils/uploadResume.js";
import supabase from "../config/supabase.js";


export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, address, coverLetter } = req.body;

  if (!name || !email || !phone || !address || !coverLetter) {
    return next(new ErrorHandler("All fields are required.", 400));
  }

  const jobSeekerInfo = {
    id: req.user._id,
    name,
    email,
    phone,
    address,
    coverLetter,
    role: "Job Seeker",
  };

  const jobDetails = await Job.findById(id);

  if (!jobDetails) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  const isAlreadyApplied = await Application.findOne({
    "jobInfo.jobId": id,
    "jobSeekerInfo.id": req.user._id,
  });

  if (isAlreadyApplied) {
    return next(
      new ErrorHandler("You have already applied for this job.", 400)
    );
  }

  // Upload a new resume if provided
  if (req.files?.resume) {
    try {
      const uploadedResume = await uploadResume(req.files.resume);

jobSeekerInfo.resume = {
  public_id: uploadedResume.path,
  url: uploadedResume.url,
};
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  } else {
    // Use the resume already uploaded in the user's profile
    if (!req.user?.resume?.public_id) {
      return next(new ErrorHandler("Please upload your resume.", 400));
    }

    jobSeekerInfo.resume = {
      public_id: req.user.resume.public_id,
      url: req.user.resume.url,
    };
  }

  const employerInfo = {
    id: jobDetails.postedBy,
    role: "Employer",
  };

  const jobInfo = {
    jobId: id,
    jobTitle: jobDetails.title,
  };

  const application = await Application.create({
    jobSeekerInfo,
    employerInfo,
    jobInfo,
  });

  res.status(201).json({
    success: true,
    message: "Application submitted.",
    application,
  });
});


export const employerGetAllApplication = catchAsyncErrors(async (req, res, next) => {
  const { _id } = req.user;

  const applications = await Application.find({
    "employerInfo.id": _id,
    "deletedBy.employer": false,
  });

  const updatedApplications = applications.map((application) => {
    const app = application.toObject();

    const resumePath = app.jobSeekerInfo?.resume?.public_id;

    if (resumePath) {
      const { data } = supabase.storage
        .from("resumes")
        .getPublicUrl(resumePath);

      app.jobSeekerInfo.resume.url = data.publicUrl;

      console.log("GENERATED RESUME URL:", data.publicUrl);
    }

    return app;
  });

  res.status(200).json({
    success: true,
    applications: updatedApplications,
  });
});

export const jobSeekerGetAllApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { _id } = req.user;
    const applications = await Application.find({
      "jobSeekerInfo.id": _id,
      "deletedBy.jobSeeker": false,
    });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const deleteApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const application = await Application.findById(id);
  if (!application) {
    return next(new ErrorHandler("Application not found.", 404));
  }
  const { role } = req.user;
  switch (role) {
    case "Job Seeker":
      application.deletedBy.jobSeeker = true;
      await application.save();
      break;
    case "Employer":
      application.deletedBy.employer = true;
      await application.save();
      break;

    default:
      console.log("Default case for application delete function.");
      break;
  }

  if (
    application.deletedBy.employer === true &&
    application.deletedBy.jobSeeker === true
  ) {
    await application.deleteOne();
  }
  res.status(200).json({
    success: true,
    message: "Application Deleted.",
  });
});
