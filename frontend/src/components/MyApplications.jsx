
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const API_URL = "http://localhost:4000/api/v1/application";

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    // Fetch Job Seeker Applications
    const fetchApplications = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get(
                `${API_URL}/jobseeker/getall`,
                {
                    withCredentials: true
                }
            );

            setApplications(data.applications || []);

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to fetch applications"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    // Delete Application
    const handleDeleteApplication = async (id) => {
        try {
            setDeletingId(id);

            const { data } = await axios.delete(
                `${API_URL}/delete/${id}`,
                {
                    withCredentials: true
                }
            );

            toast.success(data.message || "Application deleted successfully");

            setApplications((previousApplications) =>
                previousApplications.filter(
                    (application) => application._id !== id
                )
            );

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to delete application"
            );
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    if (applications.length === 0) {
        return (
            <h1 style={{ fontSize: "1.4rem", fontWeight: "600" }}>
                You have not applied for any job.
            </h1>
        );
    }

    return (
        <div className="account_components">
            <h3>My Application For Jobs</h3>

            <div className="applications_container">
                {applications.map((element) => (
                    <div className="card" key={element._id}>
                        <p className="sub-sec">
                            <span>Job Title: </span>
                            {element.jobInfo.jobTitle}
                        </p>

                        <p className="sub-sec">
                            <span>Name</span>
                            {element.jobSeekerInfo.name}
                        </p>

                        <p className="sub-sec">
                            <span>Email</span>
                            {element.jobSeekerInfo.email}
                        </p>

                        <p className="sub-sec">
                            <span>Phone: </span>
                            {element.jobSeekerInfo.phone}
                        </p>

                        <p className="sub-sec">
                            <span>Address: </span>
                            {element.jobSeekerInfo.address}
                        </p>

                        <p className="sub-sec">
                            <span>Coverletter: </span>
                            <textarea
                                value={element.jobSeekerInfo.coverLetter}
                                rows={5}
                                disabled
                                readOnly
                            />
                        </p>

                        <div className="btn-wrapper">
                            <button
                                className="outline_btn"
                                onClick={() =>
                                    handleDeleteApplication(element._id)
                                }
                                disabled={deletingId === element._id}
                            >
                                {deletingId === element._id
                                    ? "Deleting..."
                                    : "Delete Application"}
                            </button>

                            {element.jobSeekerInfo.resume?.url && (
                                <Link
                                    to={element.jobSeekerInfo.resume.url}
                                    className="btn"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Resume
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyApplications;
