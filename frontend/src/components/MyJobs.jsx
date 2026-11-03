
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const API_URL = "http://localhost:4000/api/v1/job";

const MyJobs = () => {
    const [myJobs, setMyJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    // Fetch Employer's Jobs
    const fetchMyJobs = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get(
                `${API_URL}/getmyjobs`,
                {
                    withCredentials: true
                }
            );

            setMyJobs(data.myJobs || []);

        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to fetch your jobs"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyJobs();
    }, []);

    // Delete Job
    const handleDeleteJob = async (id) => {
        try {
            setDeletingId(id);

            const { data } = await axios.delete(
                `${API_URL}/delete/${id}`,
                {
                    withCredentials: true
                }
            );

            toast.success(data.message || "Job deleted successfully");

            setMyJobs((previousJobs) =>
                previousJobs.filter((job) => job._id !== id)
            );

        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to delete job"
            );
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    if (myJobs.length === 0) {
        return (
            <h1 style={{ fontSize: "1.4rem", fontWeight: "600" }}>
                You have not posted any job!
            </h1>
        );
    }

    return (
        <div className="account_components">
            <h3>My Jobs</h3>

            <div className="applications_container">
                {myJobs.map((element) => (
                    <div className="card" key={element._id}>
                        <p className="sub-sec">
                            <span>Job Title: </span>
                            {element.title}
                        </p>

                        <p className="sub-sec">
                            <span>Job Niche:</span> {element.jobNiche}
                        </p>

                        <p className="sub-sec">
                            <span>Salary: </span> {element.salary}
                        </p>

                        <p className="sub-sec">
                            <span>Location:</span> {element.location}
                        </p>

                        <p className="sub-sec">
                            <span>Job Type:</span> {element.jobType}
                        </p>

                        <p className="sub-sec">
                            <span>Company Name:</span> {element.companyName}
                        </p>

                        <p className="sub-sec">
                            <span>Introduction:</span> {element.introduction}
                        </p>

                        <p className="sub-sec">
                            <span>Qualifications:</span> {element.qualifications}
                        </p>

                        <p className="sub-sec">
                            <span>Responsibilities:</span> {element.responsibilities}
                        </p>

                        {element.offers && (
                            <p className="sub-sec">
                                <span>What Are We Offering:</span> {element.offers}
                            </p>
                        )}

                        <button
                            className="btn"
                            onClick={() => handleDeleteJob(element._id)}
                            disabled={deletingId === element._id}
                        >
                            {deletingId === element._id
                                ? "Deleting..."
                                : "Delete Job"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyJobs;
