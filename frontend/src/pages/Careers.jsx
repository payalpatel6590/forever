import React from "react";
import { Link } from "react-router-dom";
import Title from "../componants/Title";

const jobs = [
  {
    id: 1,
    title: "MERN Stack Developer",
    location: "Surat, Gujarat",
    type: "Full Time",
    experience: "1+ Years",
  },
  {
    id: 2,
    title: "Frontend Developer",
    location: "Surat, Gujarat",
    type: "Full Time",
    experience: "Fresher / 1+ Years",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    location: "Surat, Gujarat",
    type: "Full Time",
    experience: "1+ Years",
  },
];

const Careers = () => {
  return (
    <div className="border-t pt-10">
      <div className="text-center text-2xl">
        <Title text1={"CAREER"} text2={"OPPORTUNITIES"} />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Join Our Growing Team
          </h2>
          <p className="text-gray-500 leading-7">
            We are always looking for passionate, creative, and talented people
            to build amazing digital experiences with us. Explore current openings
            and apply for the role that matches your skills.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {job.title}
              </h3>

              <div className="text-sm text-gray-500 space-y-2 mb-6">
                <p><span className="font-medium text-gray-700">Location:</span> {job.location}</p>
                <p><span className="font-medium text-gray-700">Type:</span> {job.type}</p>
                <p><span className="font-medium text-gray-700">Experience:</span> {job.experience}</p>
              </div>

              <Link
                to={`/apply-job?role=${encodeURIComponent(job.title)}`}
                onClick={() => window.scrollTo(0, 0)}
              >
                <button className="bg-black text-white px-5 py-2.5 rounded-md hover:bg-gray-800 transition">
                  Apply Now
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Careers;