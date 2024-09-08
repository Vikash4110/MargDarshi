import React from "react";
import reviews from "./section6Data";
import Section6 from "./Section6";
import underline from '../assets/curveUnderline.svg';

const Section6Main = () => {
  return (
    <div className="flex flex-col w-full  justify-center items-center bg-[#f2f5f5] ">
      <div className="text-center my-40">
      <h2 className="text-3xl md:text-5xl font-bold leading-tight flex flex-col space-y-4 mb-44">
                  <span className="relative text-primary font-bold bg-transparent">
                    <span className='text-[#127c71]'>Our</span> Testimonials
                    <img src={underline} className='absolute top-14 transform translate-y-0 left-56 rotate-3 w-24 md:w-60 h-auto' alt="underline" />
                  </span>
                 
                </h2>
        
        <Section6 reviews={reviews}/>
      </div>
    </div>
  );
};

export default Section6Main;
