
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LuMoveRight } from "react-icons/lu";

import { AuthContext } from "../context/AuthContext";

import MyProfile from "../components/MyProfile";
import UpdateProfile from "../components/UpdateProfile";
import UpdatePassword from "../components/UpdatePassword";
import MyJobs from "../components/MyJobs";
import JobPost from "../components/JobPost";
import Applications from "../components/Applications";
import MyApplications from "../components/MyApplications";

const Dashboard = () => {
  const [show, setShow] = useState(false);
  const [componentName, setComponentName] = useState("My Profile");

  const { user, isAuthenticated, logout, loading } =
    useContext(AuthContext);

  const navigateTo = useNavigate();

  // Authentication check
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigateTo("/");
    }
  }, [loading, isAuthenticated, navigateTo]);

  // Logout function
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully.");
      navigateTo("/");
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="account">
      <div className="component_header">
        <p>Dashboard</p>
        <p>
          Welcome! <span>{user?.name}</span>
        </p>
      </div>

      <div className="container">
        <div className={show ? "sidebar showSidebar" : "sidebar"}>
          <ul className="sidebar_links">
            <h4>Manage Account</h4>

            <li>
              <button
                onClick={() => {
                  setComponentName("My Profile");
                  setShow(!show);
                }}
              >
                My Profile
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  setComponentName("Update Profile");
                  setShow(!show);
                }}
              >
                Update Profile
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  setComponentName("Update Password");
                  setShow(!show);
                }}
              >
                Update Password
              </button>
            </li>

            {user?.role === "Employer" && (
              <>
                <li>
                  <button
                    onClick={() => {
                      setComponentName("Job Post");
                      setShow(!show);
                    }}
                  >
                    Post New Job
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => {
                      setComponentName("My Jobs");
                      setShow(!show);
                    }}
                  >
                    My Jobs
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => {
                      setComponentName("Applications");
                      setShow(!show);
                    }}
                  >
                    Applications
                  </button>
                </li>
              </>
            )}

            {user?.role === "Job Seeker" && (
              <li>
                <button
                  onClick={() => {
                    setComponentName("My Applications");
                    setShow(!show);
                  }}
                >
                  My Applications
                </button>
              </li>
            )}

            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>

        <div className="banner">
          <div
            className={
              show ? "sidebar_icon move_right" : "sidebar_icon move_left"
            }
          >
            <LuMoveRight
              onClick={() => setShow(!show)}
              className={show ? "left_arrow" : "right_arrow"}
            />
          </div>

          {(() => {
            switch (componentName) {
              case "My Profile":
                return <MyProfile />;

              case "Update Profile":
                return <UpdateProfile />;

              case "Update Password":
                return <UpdatePassword />;

              case "Job Post":
                return <JobPost />;

              case "My Jobs":
                return <MyJobs />;

              case "Applications":
                return <Applications />;

              case "My Applications":
                return <MyApplications />;

              default:
                return <MyProfile />;
            }
          })()}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
