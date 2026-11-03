import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";
import { uploadResume } from "../utils/uploadResume.js";
import supabase from "../config/supabase.js";

// Register
export const register = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    email,
    phone,
    address,
    password,
    role,
    firstNiche,
    secondNiche,
    thirdNiche,
    coverLetter,
  } = req.body;

  if (!name || !email || !phone || !address || !password || !role) {
    return next(new ErrorHandler("All fields are required.", 400));
  }

  if (!["Job Seeker", "Employer"].includes(role)) {
    return next(new ErrorHandler("Invalid user role.", 400));
  }

  if (role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
    return next(
      new ErrorHandler("Please provide your preferred job niches.", 400)
    );
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new ErrorHandler("Email is already registered.", 400));
  }

  const userData = {
    name,
    email,
    phone,
    address,
    password,
    role,
    niches: {
      firstNiche,
      secondNiche,
      thirdNiche,
    },
    coverLetter,
  };

  // Resume upload to Supabase
  if (req.files?.resume) {
    try {
      const resumePath = await uploadResume(req.files.resume);

      userData.resume = {
        public_id: resumePath,
        url: resumePath,
      };
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }

  const user = await User.create(userData);

  sendToken(user, 201, res, "User Registered.");
});

// Login
export const login = catchAsyncErrors(async (req, res, next) => {
  const { role, email, password } = req.body;

  if (!role || !email || !password) {
    return next(
      new ErrorHandler("Email, password and role are required.", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }

  if (user.role !== role) {
    return next(new ErrorHandler("Invalid user role.", 400));
  }

  sendToken(user, 200, res, "User logged in successfully.");
});

// Logout
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure:true,
      sameSite:"None"
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
});

// Get User
export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    user,
  });
});

// Update Profile
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    coverLetter: req.body.coverLetter,
    niches: {
      firstNiche: req.body.firstNiche,
      secondNiche: req.body.secondNiche,
      thirdNiche: req.body.thirdNiche,
    },
  };

  const { firstNiche, secondNiche, thirdNiche } = newUserData.niches;

  if (
    req.user.role === "Job Seeker" &&
    (!firstNiche || !secondNiche || !thirdNiche)
  ) {
    return next(
      new ErrorHandler("Please provide your all preferred job niches.", 400)
    );
  }

  if (req.files?.resume) {
    try {
      const resumePath = await uploadResume(req.files.resume);

      newUserData.resume = {
        public_id: resumePath,
        url: resumePath,
      };

      // Delete old resume after successful new upload
      const oldResumePath = req.user.resume?.public_id;

      if (oldResumePath) {
        const { error } = await supabase.storage
          .from(process.env.SUPABASE_BUCKET)
          .remove([oldResumePath]);

        if (error) {
          console.error("Old resume deletion failed:", error.message);
        }
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
    message: "Profile updated.",
  });
});

// Update Password
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect.", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("New password & confirm password do not match.", 400)
    );
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res, "Password updated successfully.");
});
