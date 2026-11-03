
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const API_URL = "http://localhost:4000/api/v1/user";

const UpdateProfile = () => {
  const { user, refreshUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const [firstNiche, setFirstNiche] = useState("");
  const [secondNiche, setSecondNiche] = useState("");
  const [thirdNiche, setThirdNiche] = useState("");

  const [resume, setResume] = useState(null);
  const [resumePreview, setResumePreview] = useState("");

  // User data দিয়ে form initialize করা
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setCoverLetter(user.coverLetter || "");

      setFirstNiche(user.niches?.firstNiche || "");
      setSecondNiche(user.niches?.secondNiche || "");
      setThirdNiche(user.niches?.thirdNiche || "");

      setResumePreview(user.resume?.url || "");
    }
  }, [user]);

  const nichesArray = [
    "Software Development",
    "Web Development",
    "Cybersecurity",
    "Data Science",
    "Artificial Intelligence",
    "Cloud Computing",
    "DevOps",
    "Mobile App Development",
    "Blockchain",
    "Database Administration",
    "Network Administration",
    "UI/UX Design",
    "Game Development",
    "IoT (Internet of Things)",
    "Big Data",
    "Machine Learning",
    "IT Project Management",
    "IT Support and Helpdesk",
    "Systems Administration",
    "IT Consulting",
  ];

  // Resume select করা
  const resumeHandler = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setResume(file);

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      setResumePreview(reader.result);
    };
  };

  // Profile update করা
  const handleUpdateProfile = async () => {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);

    if (user?.role === "Job Seeker") {
      formData.append("firstNiche", firstNiche);
      formData.append("secondNiche", secondNiche);
      formData.append("thirdNiche", thirdNiche);
      formData.append("coverLetter", coverLetter);
    }

    if (resume) {
      formData.append("resume", resume);
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `${API_URL}/update/profile`,
        formData,
        {
          withCredentials: true,
        }
      );

      toast.success(response.data.message || "Profile Updated.");

      // Updated user information Context-এ refresh করা
      await refreshUser();

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account_components">
      <h3>Update Profile</h3>

      <div>
        <label>Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label>Email Address</label>
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

      {user?.role === "Job Seeker" && (
        <>
          <div>
            <label>My Preferred Job Niches</label>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              <select
                value={firstNiche}
                onChange={(e) => setFirstNiche(e.target.value)}
              >
                {nichesArray.map((element) => (
                  <option value={element} key={element}>
                    {element}
                  </option>
                ))}
              </select>

              <select
                value={secondNiche}
                onChange={(e) => setSecondNiche(e.target.value)}
              >
                {nichesArray.map((element) => (
                  <option value={element} key={element}>
                    {element}
                  </option>
                ))}
              </select>

              <select
                value={thirdNiche}
                onChange={(e) => setThirdNiche(e.target.value)}
              >
                {nichesArray.map((element) => (
                  <option value={element} key={element}>
                    {element}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label>Coverletter</label>

            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={5}
            />
          </div>

          <div>
            <label>Upload Resume</label>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={resumeHandler}
            />

            {resumePreview && (
              <div>
                <p>Current Resume:</p>

                <Link
                  to={
                    resumePreview.startsWith("data:")
                      ? "#"
                      : resumePreview
                  }
                  onClick={(e) => {
                    if (resumePreview.startsWith("data:")) {
                      e.preventDefault();
                      window.open(resumePreview, "_blank");
                    }
                  }}
                  target="_blank"
                  className="view-resume"
                >
                  View Resume
                </Link>
              </div>
            )}
          </div>
        </>
      )}

      <div className="save_change_btn_wrapper">
        <button
          className="btn"
          onClick={handleUpdateProfile}
          disabled={loading}
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default UpdateProfile;
