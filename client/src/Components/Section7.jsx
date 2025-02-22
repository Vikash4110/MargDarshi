import React, { useState, useRef, useEffect } from 'react';

import faq from '../assets/vecteezy_hands-using-a-smartphone-and-registering-online_8258613.svg';
import underline from '../assets/curveUnderline.svg';


const AboutItem = ({ title, isOpen, onClick, content }) => {
    const contentRef = useRef(null);
    const [contentHeight, setContentHeight] = useState('0px');

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
        }
    }, [isOpen]);

    return (
        <div className="mb-4">
            <div
                className={`bg-[#127c71] text-white flex items-center justify-between p-4 rounded-full cursor-pointer ${isOpen ? 'shadow-lg' : ''}`}
                onClick={onClick}
            >
                <h3 className="font-semibold text-base md:text-lg lg:text-xl">{title}</h3>
                <div className="w-8 h-8 bg-white text-[#127c71] rounded-full flex items-center justify-center text-lg md:text-xl">
                    {isOpen ? '-' : '+'}
                </div>
            </div>
            <div
                className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
                style={{ maxHeight: contentHeight }}
            >
                <div
                    className="bg-white text-[#127c71] p-4 rounded-3xl shadow-inner"
                    ref={contentRef}
                >
                    {content}
                </div>
            </div>
        </div>
    );
};

const About = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const items = [
        {
            title: "How to join as a mentor/mentee?",
            content: "To join as a mentor or mentee, you need to sign up through our registration form. Mentors must provide their qualifications, while mentees should share their career goals."
        },
        {
            title: "What are the session costs?",
            content: "Our sessions are free for mentees. However, mentors may offer paid sessions depending on their preferences and expertise."
        },
        {
            title: "How are mentors vetted?",
            content: "Mentors are vetted through a rigorous process, including background checks, qualifications verification, and interviews to ensure they provide valuable guidance."
        },

    ];

    const toggleItem = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    return (
        <div className="max-w-md mx-auto rounded-2xl p-8 bg-gradient-to-br from-gray-50 to-teal-50  " data-aos="fade-up" >
         <h2 className="text-3xl md:text-5xl font-bold leading-tight flex flex-col space-y-4 mb-20 text-center">
            <span className="relative text-primary font-bold bg-transparent">
                <span className='text-[#127c71]'>FAQ's</span>
                <img src={underline} className='absolute top-14 transform translate-y-0 left-28 rotate-3 w-24 md:w-36 h-auto' alt="underline" />
            </span>

        </h2>
            {items.map((item, index) => (
                <AboutItem
                    key={index}
                    title={item.title}
                    isOpen={activeIndex === index}
                    onClick={() => toggleItem(index)}
                    content={item.content}
                />
            ))}
        </div>
    );
};

const ContentSection = () => (


    <div className='relative flex justify-center items-center flex-col text-center sm:text-left' data-aos="zoom-out">

       
        <img src={faq} className='mx-auto' />
    </div>




);

const AboutLayout = () => (

    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-teal-50 ">

        <div className="flex  flex-col lg:flex-row items-center lg:items-start justify-between max-w-6xl mx-auto  px-4  mb-0  mt-32 md:mb-0 lg:mb-24 ">
            <div className='mt-8 lg:mt-12 lg:ml-8 w-5/6 flex-grow lg:w-full order-2 lg:order-1 ' >
                <About />

            </div>

            <div className=" lg:mt-0 lg:ml-8 flex-grow order-1 lg:order-2 w-5/6 m-auto lg:w-full">
                <ContentSection />
            </div>
        </div>
    </div>
);

export default AboutLayout;
