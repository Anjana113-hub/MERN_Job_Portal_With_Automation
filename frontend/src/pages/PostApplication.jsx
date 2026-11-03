
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { IoMdCash } from "react-icons/io";
import { FaToolbox } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

const API_URL = "http://localhost:4000/api/v1";

const PostApplication = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { jobId } = useParams();
  const navigateTo = useNavigate();

  const [singleJob, setSingleJob] = useState({});
  const [loading, setLoading] = useState(false);
  const [jobLoading, setJobLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);

  // Single job fetch করা
  useEffect(() => {
    const fetchSingleJob = async () => {
      setJobLoading(true);

      try {
        const response = await axios.get(
          `${API_URL}/job/get/${jobId}`
        );

        setSingleJob(response.data.job || {});
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch job details"
        );
      } finally {
        setJobLoading(false);
      }
    };

    fetchSingleJob();
  }, [jobId]);

  // User-এর existing information form-এ বসানো
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setCoverLetter(user.coverLetter || "");
    }
  }, [user]);

  // Application submit করা
  const handlePostApplication = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !address) {
      toast.error("Please fill in all required fields");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);

    if (resume instanceof File) {
      formData.append("resume", resume);
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/application/post/${jobId}`,
        formData,
        {
          withCredentials: true,
        }
      );

      toast.success(
        response.data.message || "Application submitted successfully"
      );

      navigateTo("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit application"
      );
    } finally {
      setLoading(false);
    }
  };

  // Resume select করা
  const resumeHandler = (e) => {
    const file = e.target.files[0];

    if (file) {
      setResume(file);
    }
  };

  if (jobLoading) {
    return <h3>Loading job details...</h3>;
  }

  let qualifications = [];
  let responsibilities = [];
  let offering = [];

  if (singleJob.qualifications) {
    qualifications = singleJob.qualifications.split(". ");
  }

  if (singleJob.responsibilities) {
    responsibilities = singleJob.responsibilities.split(". ");
  }

  if (singleJob.offers) {
    offering = singleJob.offers.split(". ");
  }

  return (
    <>
      <article className="application_page">
        <form onSubmit={handlePostApplication}>
          <h3>Application Form</h3>

          <div>
            <label>Job Title</label>
            <input type="text" placeholder={singleJob.title} disabled />
          </div>

          <div>
            <label>Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label>Your Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label>Phone Number</label>
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label>Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {user && user.role === "Job Seeker" && (
            <>
              <div>
                <label>Coverletter</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={10}
                />
              </div>

              <div>
                <label>Resume</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={resumeHandler}
                />
              </div>
            </>
          )}

          {isAuthenticated && user?.role === "Job Seeker" && (
            <div style={{ alignItems: "flex-end" }}>
              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Apply"}
              </button>
            </div>
          )}
        </form>

        <div className="job-details">
          <header>
            <h3>{singleJob.title}</h3>

            {singleJob.personalWebsite && (
              <Link
                target="_blank"
                to={singleJob.personalWebsite.url}
                rel="noopener noreferrer"
              >
                {singleJob.personalWebsite.title}
              </Link>
            )}

            <p>{singleJob.location}</p>
            <p>Rs. {singleJob.salary} a month</p>
          </header>

          <hr />

          <section>
            <div className="wrapper">
              <h3>Job details</h3>

              <div>
                <IoMdCash />
                <div>
                  <span>Pay</span>
                  <span>{singleJob.salary} a month</span>
                </div>
              </div>

              <div>
                <FaToolbox />
                <div>
                  <span>Job type</span>
                  <span>{singleJob.jobType}</span>
                </div>
              </div>
            </div>

            <hr />

            <div className="wrapper">
              <h3>Location</h3>

              <div className="location-wrapper">
                <FaLocationDot />
                <span>{singleJob.location}</span>
              </div>
            </div>

            <hr />

            <div className="wrapper">
              <h3>Full Job Description</h3>

              <p>{singleJob.introduction}</p>

              {singleJob.qualifications && (
                <div>
                  <h4>Qualifications</h4>
                  <ul>
                    {qualifications.map((element, index) => (
                      <li key={index} style={{ listStyle: "inside" }}>
                        {element}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {singleJob.responsibilities && (
                <div>
                  <h4>Responsibilities</h4>
                  <ul>
                    {responsibilities.map((element, index) => (
                      <li key={index} style={{ listStyle: "inside" }}>
                        {element}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {singleJob.offers && (
                <div>
                  <h4>Offering</h4>
                  <ul>
                    {offering.map((element, index) => (
                      <li key={index} style={{ listStyle: "inside" }}>
                        {element}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          <hr />

          <footer>
            <h3>Job Niche</h3>
            <p>{singleJob.jobNiche}</p>
          </footer>
        </div>
      </article>
    </>
  );
};

export default PostApplication;
