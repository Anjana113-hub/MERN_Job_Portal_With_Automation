
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const MyProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="account_components">
      <h3>My Profile</h3>

      <div>
        <label>Full Name</label>
        <input
          type="text"
          disabled
          value={user?.name || ""}
        />
      </div>

      <div>
        <label>Email Address</label>
        <input
          type="email"
          disabled
          value={user?.email || ""}
        />
      </div>

      {user?.role === "Job Seeker" && (
        <div>
          <label>My Preferred Job Niches</label>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <input
              type="text"
              disabled
              value={user?.niches?.firstNiche || ""}
            />

            <input
              type="text"
              disabled
              value={user?.niches?.secondNiche || ""}
            />

            <input
              type="text"
              disabled
              value={user?.niches?.thirdNiche || ""}
            />
          </div>
        </div>
      )}

      <div>
        <label>Phone Number</label>
        <input
          type="text"
          disabled
          value={user?.phone || ""}
        />
      </div>

      <div>
        <label>Address</label>
        <input
          type="text"
          disabled
          value={user?.address || ""}
        />
      </div>

      <div>
        <label>Role</label>
        <input
          type="text"
          disabled
          value={user?.role || ""}
        />
      </div>

      <div>
        <label>Joined On</label>
        <input
          type="text"
          disabled
          value={
            user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : ""
          }
        />
      </div>
    </div>
  );
};

export default MyProfile;
