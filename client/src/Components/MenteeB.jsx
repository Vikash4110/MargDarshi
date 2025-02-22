import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import airplane from '../assets/vecteezy_3d-space-rocket-render-with-transparent-background_22996345.png';
import './MenteeB.css';

gsap.registerPlugin(ScrollTrigger);

const MenteeB = () => {
    const rocketRef = useRef(null);

    useEffect(() => {
        const rocket = rocketRef.current;

        // GSAP Animation
        gsap.to(rocket, {
            y: 800, // Move the rocket upwards
            rotate: 45, // Tilt the rocket
            scrollTrigger: {
                trigger: rocket, // Trigger animation when the rocket is in view
                start: 'top center', // Start animation when the top of the rocket reaches the center of the viewport
                end: 'bottom top', // End animation when the bottom of the rocket reaches the top of the viewport
                scrub: 1, // Smoothly animate as the user scrolls
            },
        });
    }, []);

    return (
        <div className="airplane-animation bg-[#F7F7F7] py-20">
            <div className="flex flex-col items-center text-center px-4">
                {/* Rocket Image */}
                <img 
                    ref={rocketRef}
                    src={airplane} 
                    className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4" 
                    alt="Rocket" 
                />
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4" data-aos="fade-up" data-aos-duration="1000">
                    <span className="text-[#212529]">"A Mentor is Someone Who </span>
                    <span className="text-[#0DC9C5]">Sees More Talent in You Than You See in Yourself."</span>
                </h1>
                <p className="text-sm md:text-base lg:text-lg font-medium max-w-2xl" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1000">
                    Unlock your full potential with our mentorship program! We provide expert guidance, career advice, and hands-on training to help you achieve your goals.  
                    Whether you're looking to develop new skills, grow your business, or navigate challenges, we are here to support you every step of the way.
                </p>
            </div>
        </div>
    );
}

export default MenteeB;