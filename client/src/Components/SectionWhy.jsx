import React from 'react';
import { AiOutlineCalendar, AiOutlineRobot, AiOutlineVideoCamera } from 'react-icons/ai'; // Importing icons from react-icons

const features = [
    {
        icon: <AiOutlineCalendar className="w-12 h-12 text-primary" />,
        title: 'Automated Calendar Booking',
        description: 'Easily schedule and manage meetings with automated calendar integration.',
    },
    {
        icon: <AiOutlineRobot className="w-12 h-12 text-primary" />,
        title: 'AI-Based Mentor Matching',
        description: 'Connect with the most suitable mentors using our intelligent AI matching system.',
    },
    {
        icon: <AiOutlineVideoCamera className="w-12 h-12 text-primary" />,
        title: 'Video Calling',
        description: 'Engage in seamless video calls for a more interactive mentoring experience.',
    },
];

const WhyMargDarshi = () => {
    return (
        <section id="why-margdarshi" className="bg-[#f2f5f5] py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8"><span className='relative'>Why <span className='text-[#127c71]'>MargDarshi</span> ?
                <svg className="absolute -top-3 -right-8 w-6 md:w-8 h-auto" viewBox="0 0 3183 3072">
                    <path fill="#127C71" d="M2600 224c0,0 0,0 0,0 236,198 259,562 52,809 -254,303 -1849,2089 -2221,1776 -301,-190 917,-1964 1363,-2496 207,-247 570,-287 806,-89z" />
                    <path fill="#127C71" d="M3166 2190c0,0 0,0 0,0 64,210 -58,443 -270,516 -260,90 -1848,585 -1948,252 -104,-230 1262,-860 1718,-1018 212,-73 437,39 500,250z" />
                    <path fill="#127C71" d="M566 3c0,0 0,0 0,0 -219,-26 -427,134 -462,356 -44,271 -255,1921 90,1962 245,62 628,-1392 704,-1869 36,-221 -114,-424 -332,-449z" />
                </svg></span></h2>
                <div className="flex flex-col md:flex-row justify-center gap-8 flex-wrap">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg text-center">
                            {feature.icon}
                            <h3 className="text-xl font-bold text-primary mt-4 mb-2  text-[#127c71]">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyMargDarshi;
