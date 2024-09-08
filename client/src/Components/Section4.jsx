import React from 'react';
import { FaUser, FaSearch, FaCalendarAlt, FaVideo } from 'react-icons/fa';

const steps = [
  {
    id: 1,
    title: 'Create Profile',
    icon: <FaUser className="text-4xl text-red-500" />,
    description: 'Set up your profile to connect with experienced mentors.',
  },
  {
    id: 2,
    title: 'Search for Mentors',
    icon: <FaSearch className="text-4xl text-blue-500" />,
    description: 'Browse and find the perfect mentor for your career goals.',
  },
  {
    id: 3,
    title: 'Book Sessions',
    icon: <FaCalendarAlt className="text-4xl text-green-500" />,
    description: 'Schedule your sessions at a convenient time.',
  },
  {
    id: 4,
    title: 'Attend Virtual Meetings',
    icon: <FaVideo className="text-4xl text-purple-500" />,
    description: 'Meet your mentor via video calls and receive expert guidance.',
  },
];

const HowItWorksCurvyFlowchart = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 relative">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        {/* SVG Curved Path */}
        <svg className="absolute left-1/2 transform -translate-x-24 top-24 z-0" width="900" height="800" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M 100 50 Q -150 80 100 160 T 100 320 T 100 480 T 100 640" 
            stroke="gray" strokeWidth="2" fill="none" />
        </svg>

        {/* Step-by-step curvy flowchart */}
        <div className="flex flex-col items-center relative z-10">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative mb-16">
              {/* Icon with background */}
              <div className="flex items-center justify-center w-24 h-24 bg-white shadow-xl rounded-full mb-4 z-10">
                {step.icon}
              </div>
              {/* Title & Description */}
              <div className="text-center z-10">
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 max-w-xs">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksCurvyFlowchart;
