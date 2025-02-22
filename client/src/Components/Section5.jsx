import React from 'react';
import backgroundImage from '../assets/backimg.jpg'

const CallToAction = () => {
  return (
    <section className=" bg-gradient-to-br from-gray-50 to-teal-50 py-12 px-4 flex flex-col items-center"
    style={{
        backgroundImage: `url(${backgroundImage}), linear-gradient(to right, #4b4b4b, #1e1e1e)`,
        backgroundBlendMode: 'overlay',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: "fixed"
      }}>
      <h2 className="text-3xl font-bold mb-6 text-center text-white">
        Ready to make a difference?
      </h2>
      <p className="text-lg mb-8 text-center text-white">
        Whether you want to advance your career or share your expertise, we have a place for you.
      </p>
      <div className="flex space-x-4">
        {/* Get Started as a Mentee Button */}
        <a
          href="#get-started" // Replace with your actual link
          className="bg-[#127c71] hover:bg-[#0f6f5c]] text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out"
        >
          Get Started as a Mentee
        </a>
        {/* Join as a Mentor Button */}
        <a
          href="#join-mentor" // Replace with your actual link
          className="bg-[#323290] hover:bg-[#2a2e76] text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out"
        >
          Join as a Mentor
        </a>
      </div>
    </section>
  );
};

export default CallToAction;
