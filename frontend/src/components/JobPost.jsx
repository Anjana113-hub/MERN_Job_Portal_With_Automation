
import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CiCircleInfo } from "react-icons/ci";
import { AuthContext } from "../context/AuthContext";

const API_URL = "http://localhost:4000/api/v1/job";

const JobPost = () => {
    const { user, isAuthenticated } = useContext(AuthContext);

    const [title, setTitle] = useState("");
    const [jobType, setJobType] = useState("");
    const [location, setLocation] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [introduction, setIntroduction] = useState("");
    const [responsibilities, setResponsibilities] = useState("");
    const [qualifications, setQualifications] = useState("");
    const [offers, setOffers] = useState("");
    const [jobNiche, setJobNiche] = useState("");
    const [salary, setSalary] = useState("");
    const [hiringMultipleCandidates, setHiringMultipleCandidates] = useState("");
    const [personalWebsiteTitle, setPersonalWebsiteTitle] = useState("");
    const [personalWebsiteUrl, setPersonalWebsiteUrl] = useState("");

    const [loading, setLoading] = useState(false);

    const nichesArray = [
        "Software Development",
        "Web Development",
        "Cybersecurity",
        "Data Science",
        "Artificial Intelligence",
        "Cloud Computing",
        "DevOps",
        "MERN Stack Development",
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

    const cities = [
        "Bangalore",
        "Kolkata",
        "Indore",
        "Punjab",
        "Gujrat",
        "Pune",
        "Hyderabad",
        "Arunachal Pradesh",
        "Durgapur",
        "Mumbai",
        "Howrah",
        "Bardhaman",
        "Chennai",
        "Noida",
        "Gurgaon",
        "Rajasthan",
        "America",
        "Bhubonesware",
        "Ludihana",
        "Chandigore",
    ];

    const handlePostJob = async () => {
        if (!isAuthenticated || user?.role !== "Employer") {
            toast.error("Only employers can post jobs");
            return;
        }

        if (
            !title ||
            !jobType ||
            !location ||
            !companyName ||
            !introduction ||
            !responsibilities ||
            !qualifications ||
            !jobNiche ||
            !salary
        ) {
            toast.error("Please fill all required fields");
            return;
        }

        const formData = new FormData();

        formData.append("title", title);
        formData.append("jobType", jobType);
        formData.append("location", location);
        formData.append("companyName", companyName);
        formData.append("introduction", introduction);
        formData.append("responsibilities", responsibilities);
        formData.append("qualifications", qualifications);
        formData.append("jobNiche", jobNiche);
        formData.append("salary", salary);

        if (offers) {
            formData.append("offers", offers);
        }

        if (hiringMultipleCandidates) {
            formData.append(
                "hiringMultipleCandidates",
                hiringMultipleCandidates
            );
        }

        if (personalWebsiteTitle) {
            formData.append("personalWebsiteTitle", personalWebsiteTitle);
        }

        if (personalWebsiteUrl) {
            formData.append("personalWebsiteUrl", personalWebsiteUrl);
        }

        try {
            setLoading(true);

            const { data } = await axios.post(
                `${API_URL}/post`,
                formData,
                {
                    withCredentials: true
                }
            );

            toast.success(data.message || "Job Posted Successfully");

            // Reset form after successful job posting
            setTitle("");
            setJobType("");
            setLocation("");
            setCompanyName("");
            setIntroduction("");
            setResponsibilities("");
            setQualifications("");
            setOffers("");
            setJobNiche("");
            setSalary("");
            setHiringMultipleCandidates("");
            setPersonalWebsiteTitle("");
            setPersonalWebsiteUrl("");

        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to post job"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="account_components">
            <h3>Post A Job</h3>

            <div>
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Job Title"
                />
            </div>

            <div>
                <label>Job Type</label>
                <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                >
                    <option value="">Select Job Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                </select>
            </div>

            <div>
                <label>Location (City)</label>
                <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                >
                    <option value="">Select Job Location</option>
                    {cities.map((element) => (
                        <option key={element} value={element}>
                            {element}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Company Name</label>
                <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Company Name"
                />
            </div>

            <div>
                <label>Company/Job Introduction</label>
                <textarea
                    value={introduction}
                    onChange={(e) => setIntroduction(e.target.value)}
                    placeholder="Company / Job Introduction"
                    rows={7}
                />
            </div>

            <div>
                <label>Responsibilities</label>
                <textarea
                    value={responsibilities}
                    onChange={(e) => setResponsibilities(e.target.value)}
                    placeholder="Job Responsibilities"
                    rows={7}
                />
            </div>

            <div>
                <label>Qualifications</label>
                <textarea
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    placeholder="Required Qualifications For Job"
                    rows={7}
                />
            </div>

            <div>
                <div className="label-infoTag-wrapper">
                    <label>What We Offer</label>
                    <span>
                        <CiCircleInfo /> Optional
                    </span>
                </div>

                <textarea
                    value={offers}
                    onChange={(e) => setOffers(e.target.value)}
                    placeholder="What are we offering in return!"
                    rows={7}
                />
            </div>

            <div>
                <label>Job Niche</label>
                <select
                    value={jobNiche}
                    onChange={(e) => setJobNiche(e.target.value)}
                >
                    <option value="">Select Job Niche</option>
                    {nichesArray.map((element) => (
                        <option key={element} value={element}>
                            {element}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Salary</label>
                <input
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="50000 - 800000"
                />
            </div>

            <div>
                <div className="label-infoTag-wrapper">
                    <label>Hiring Multiple Candidates?</label>
                    <span>
                        <CiCircleInfo /> Optional
                    </span>
                </div>

                <select
                    value={hiringMultipleCandidates}
                    onChange={(e) =>
                        setHiringMultipleCandidates(e.target.value)
                    }
                >
                    <option value="">Hiring Multiple Candidates?</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>

            <div>
                <div className="label-infoTag-wrapper">
                    <label>Personal Website Name</label>
                    <span>
                        <CiCircleInfo /> Optional
                    </span>
                </div>

                <input
                    type="text"
                    value={personalWebsiteTitle}
                    onChange={(e) => setPersonalWebsiteTitle(e.target.value)}
                    placeholder="Personal Website Name/Title"
                />
            </div>

            <div>
                <div className="label-infoTag-wrapper">
                    <label>Personal Website Link (URL)</label>
                    <span>
                        <CiCircleInfo /> Optional
                    </span>
                </div>

                <input
                    type="text"
                    value={personalWebsiteUrl}
                    onChange={(e) => setPersonalWebsiteUrl(e.target.value)}
                    placeholder="Personal Website Link (URL)"
                />
            </div>

            <div>
                <button
                    style={{ margin: "0 auto" }}
                    className="btn"
                    onClick={handlePostJob}
                    disabled={loading}
                >
                    {loading ? "Posting..." : "Post Job"}
                </button>
            </div>
        </div>
    );
};

export default JobPost;
