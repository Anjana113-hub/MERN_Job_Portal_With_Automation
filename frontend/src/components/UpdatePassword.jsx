
import React, { useState } from "react";
import axios from "axios";
import { FaRegEyeSlash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";

const API_URL = "http://localhost:4000/api/v1/user";

const UpdatePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill all password fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.put(
                `${API_URL}/update/password`,
                {
                    oldPassword,
                    newPassword,
                    confirmPassword
                },
                {
                    withCredentials: true
                }
            );

            toast.success(data.message || "Password Updated");

            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error) {
            toast.error(
                error.response?.data?.message || "Password update failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="account_components update_password_component">
            <h3>Update Password</h3>

            <div>
                <label>Current Password</label>
                <input
                    type={showPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />

                {showPassword ? (
                    <FaRegEyeSlash
                        className="eye_icon"
                        onClick={() => setShowPassword(false)}
                    />
                ) : (
                    <FaEye
                        className="eye_icon"
                        onClick={() => setShowPassword(true)}
                    />
                )}
            </div>

            <div>
                <label>New Password</label>
                <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                {showPassword ? (
                    <FaRegEyeSlash
                        className="eye_icon"
                        onClick={() => setShowPassword(false)}
                    />
                ) : (
                    <FaEye
                        className="eye_icon"
                        onClick={() => setShowPassword(true)}
                    />
                )}
            </div>

            <div>
                <label>Confirm Password</label>
                <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {showPassword ? (
                    <FaRegEyeSlash
                        className="eye_icon"
                        onClick={() => setShowPassword(false)}
                    />
                ) : (
                    <FaEye
                        className="eye_icon"
                        onClick={() => setShowPassword(true)}
                    />
                )}
            </div>

            <div className="save_change_btn_wrapper">
                <button
                    className="btn"
                    onClick={handleUpdatePassword}
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </div>
        </div>
    );
};

export default UpdatePassword;
