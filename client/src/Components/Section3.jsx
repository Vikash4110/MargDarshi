import React from 'react';
import { FaUserTie, FaCalendarCheck, FaChartLine } from "react-icons/fa6";

const StatisticsSection = () => {
  return (
    <section className="py-12 bg-white  ">
      <div className="container mx-auto px-4">
        

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Number of Mentors */}
          <div className="bg-white p-6 rounded-lg shadow-lg   text-center">
            <div className="flex justify-center items-center text-5xl text-[#127c71] mb-4">
              <FaUserTie />
            </div>
            <h3 className="text-2xl font-semibold mb-2">120+ Mentors</h3>
            <p className="text-gray-600">Expert mentors from top companies worldwide.</p>
          </div>

          {/* Sessions Completed */}
          <div className="bg-white p-6 rounded-lg shadow-lg   text-center">
            <div className="flex justify-center items-center text-5xl text-[#127c71] mb-4">
              <FaCalendarCheck />
            </div>
            <h3 className="text-2xl font-semibold mb-2">5,000+ Sessions</h3>
            <p className="text-gray-600">Mentorship sessions successfully conducted.</p>
          </div>

          {/* Success Rate */}
          <div className="bg-white p-6 rounded-lg shadow-lg  text-center">
            <div className="flex justify-center items-center text-5xl text-[#127c71] mb-4">
              <FaChartLine />
            </div>
            <h3 className="text-2xl font-semibold mb-2">95% Success Rate</h3>
            <p className="text-gray-600">Mentees achieved career milestones.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
