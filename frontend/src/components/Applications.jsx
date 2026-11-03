import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Employer applications fetch 
  const fetchApplications = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/application/employer/getall",
        {
          withCredentials: true,
        },
      );

      setApplications(response.data.applications || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch applications",
      );
    } finally {
      setLoading(false);
    }
  };

  // Component load applications fetch
  useEffect(() => {
    fetchApplications();
  }, []);

  // Application delete করা
  const handleDeleteApplication = async (id) => {
    setDeletingId(id);

    try {
      const response = await axios.delete(
        `http://localhost:4000/api/v1/application/delete/${id}`,
        {
          withCredentials: true,
        },
      );

      toast.success(
        response.data.message || "Application deleted successfully",
      );

      // Delete হওয়ার পর UI থেকে application সরানো
      setApplications((previousApplications) =>
        previousApplications.filter((application) => application._id !== id),
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete application",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : applications.length === 0 ? (
        <h1>You have no applications from job seekers.</h1>
      ) : (
        <div className="account_components">
          <h3>Applications For Your Posted Jobs</h3>

          <div className="applications_container">
            {applications.map((element) => (
              <div className="card" key={element._id}>
                <p className="sub-sec">
                  <span>Job Title: </span>
                  {element.jobInfo.jobTitle}
                </p>

                <p className="sub-sec">
                  <span>Applicant's Name: </span>
                  {element.jobSeekerInfo.name}
                </p>

                <p className="sub-sec">
                  <span>Applicant's Email: </span>
                  {element.jobSeekerInfo.email}
                </p>

                <p className="sub-sec">
                  <span>Applicant's Phone: </span>
                  {element.jobSeekerInfo.phone}
                </p>

                <p className="sub-sec">
                  <span>Applicant's Address: </span>
                  {element.jobSeekerInfo.address}
                </p>

                <p className="sub-sec">
                  <span>Applicant's CoverLetter: </span>
                  <textarea
                    value={element.jobSeekerInfo.coverLetter || ""}
                    rows={5}
                    disabled
                    readOnly
                  />
                </p>

                <div className="btn-wrapper">
                  <button
                    className="outline_btn"
                    onClick={() => handleDeleteApplication(element._id)}
                    disabled={deletingId === element._id}
                  >
                    {deletingId === element._id
                      ? "Deleting..."
                      : "Delete Application"}
                  </button>

                  {element.jobSeekerInfo?.resume?.url ? (
                    <a
                      href={element.jobSeekerInfo.resume.url}
                      className="btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resume
                    </a>
                  ) : (
                    <button className="btn" disabled>
                      Resume Not Available
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Applications;
