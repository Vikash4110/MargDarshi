import React from 'react';
import homeHero from '../assets/homeHero.png';
import underline from '../assets/curveUnderline.svg';

const exps = [
  { label: 'Students', value: '10K+' },
  { label: 'Quality Course', value: '20+' },
  { label: 'Experience Mentors', value: '10+' },
];

const ExpItem = ({ item }) => {
  const { value, label } = item;
  return (
    <div className="text-center mb-4 md:mb-0">
      <p className="text-secondary mb-2 text-3xl md:text-5xl font-bold">{value}</p>
      <p className="text-gray-600 text-sm md:text-lg">{label}</p>
    </div>
  );
};

const HomeHero = () => {
  return (
    <section id="hero" className="bg-background-paper relative pt-6 pb-8 md:pb-12 mx-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:space-x-8">
          <div className="flex-1 md:w-7/12 text-center md:text-left">
            <div className="flex flex-col justify-center h-full space-y-6 md:space-y-10">
              <div className="relative">
                <h2 className="text-3xl md:text-5xl font-bold leading-tight flex flex-col space-y-4">
                  <span className="relative text-primary font-bold bg-transparent">
                    <span className='text-[#127c71]'>Shape</span> Your Future
                    <img src={underline} className='absolute top-14 transform -translate-y-1/2 left-0 rotate-3 w-24 md:w-36 h-auto' alt="underline" />
                  </span>
                  <div className="flex flex-col md:flex-row items-center">
                    <span className='mr-0 md:mr-6'>with Expert</span>
                    <span className="relative">
                      Guidance
                      <svg className="absolute top-[-4px] right-[-5px] w-6 md:w-8 h-auto" viewBox="0 0 3183 3072">
                        <path fill="#127C71" d="M2600 224c0,0 0,0 0,0 236,198 259,562 52,809 -254,303 -1849,2089 -2221,1776 -301,-190 917,-1964 1363,-2496 207,-247 570,-287 806,-89z" />
                        <path fill="#127C71" d="M3166 2190c0,0 0,0 0,0 64,210 -58,443 -270,516 -260,90 -1848,585 -1948,252 -104,-230 1262,-860 1718,-1018 212,-73 437,39 500,250z" />
                        <path fill="#127C71" d="M566 3c0,0 0,0 0,0 -219,-26 -427,134 -462,356 -44,271 -255,1921 90,1962 245,62 628,-1392 704,-1869 36,-221 -114,-424 -332,-449z" />
                      </svg>
                    </span>
                  </div>
                </h2>
              </div>
              <div className="text-gray-600 text-base md:text-lg leading-relaxed">
                “ Connect with Industry Leaders to Accelerate Your Career "
              </div>
              <div className="flex flex-col md:flex-row justify-center md:justify-start space-y-2 md:space-y-0 md:space-x-4">
                <button className="bg-[#127C71] text-white font-semibold py-2 px-4 rounded-full hover:bg-[#0f6f5c] transition">
                  Join as Mentee
                </button>
                <button className="border-2 border-[#127C71] text-[#127C71] font-semibold py-2 px-4 rounded-full hover:bg-[#127C71] hover:text-white transition">
                  Become a Mentor
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 md:w-5/12 relative mt-8 md:mt-0">
            <div className="w-full">
              <img src={homeHero} className='w-full h-auto' alt="homeHero" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
