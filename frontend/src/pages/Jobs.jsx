
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Jobs = () => {
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [niche, setNiche] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  // Redux useSelector er bodole local state
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      let link = "http://localhost:4000/api/v1/job/getall";
      const queryParams = [];

      if (searchKeyword.trim()) {
        queryParams.push(
          `searchKeyword=${encodeURIComponent(searchKeyword.trim())}`
        );
      }

      if (city && city !== "All") {
        queryParams.push(`city=${encodeURIComponent(city)}`);
      }

      if (niche && niche !== "All") {
        queryParams.push(`niche=${encodeURIComponent(niche)}`);
      }

      if (queryParams.length > 0) {
        link += `?${queryParams.join("&")}`;
      }

      const response = await axios.get(link, {
        withCredentials: true,
      });

      setJobs(response.data.jobs || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch jobs"
      );
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (city) => {
    setCity(city);
    setSelectedCity(city);
  };

  const handleNicheChange = (niche) => {
    setNiche(niche);
    setSelectedNiche(niche);
  };

  useEffect(() => {
    fetchJobs();
  }, [city, niche]);

  const handleSearch = () => {
    fetchJobs();
  };

  const cities = [
    "All",
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
    "Odisha",
    "Chandigore",
  ];

  const nichesArray = [
    "All",
    "Software Development",
    "Web Development",
    "Cybersecurity",
    "MERN Stack Development",
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

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <section className="jobs">
          <div className="search-tab-wrapper">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search jobs..."
            />
            <button onClick={handleSearch}>Find Job</button>
            <FaSearch />
          </div>

          <div className="wrapper">
            <div className="filter-bar">
              <div className="cities">
                <h2>Filter Job By City</h2>
                {cities.map((city, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      id={`city-${index}`}
                      name="city"
                      value={city}
                      checked={selectedCity === city}
                      onChange={() => handleCityChange(city)}
                    />
                    <label htmlFor={`city-${index}`}>{city}</label>
                  </div>
                ))}
              </div>

              <div className="cities">
                <h2>Filter Job By Niche</h2>
                {nichesArray.map((niche, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      id={`niche-${index}`}
                      name="niche"
                      value={niche}
                      checked={selectedNiche === niche}
                      onChange={() => handleNicheChange(niche)}
                    />
                    <label htmlFor={`niche-${index}`}>{niche}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="container">
              <div className="mobile-filter">
                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setSelectedCity(e.target.value);
                  }}
                >
                  <option value="">Filter By City</option>
                  {cities.map((city, index) => (
                    <option value={city} key={index}>
                      {city}
                    </option>
                  ))}
                </select>

                <select
                  value={niche}
                  onChange={(e) => {
                    setNiche(e.target.value);
                    setSelectedNiche(e.target.value);
                  }}
                >
                  <option value="">Filter By Niche</option>
                  {nichesArray.map((niche, index) => (
                    <option value={niche} key={index}>
                      {niche}
                    </option>
                  ))}
                </select>
              </div>

              <div className="jobs_container">
                {jobs && jobs.length > 0 ? (
                  jobs.map((element) => (
                    <div className="card" key={element._id}>
                      {element.hiringMultipleCandidates === "Yes" ? (
                        <p className="hiring-multiple">
                          Hiring Multiple Candidates
                        </p>
                      ) : (
                        <p className="hiring">Hiring</p>
                      )}

                      <p className="title">{element.title}</p>
                      <p className="company">{element.companyName}</p>
                      <p className="location">{element.location}</p>

                      <p className="salary">
                        <span>Salary:</span> Rs. {element.salary}
                      </p>

                      <p className="posted">
                        <span>Posted On:</span>{" "}
                        {element.jobPostedOn?.substring(0, 10)}
                      </p>

                      <div className="btn-wrapper">
                        <Link
                          className="btn"
                          to={`/post/application/${element._id}`}
                        >
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <img
                    src="./404-error.jpg"
                    alt="job-not-found"
                    style={{ width: "100%" }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Jobs;
