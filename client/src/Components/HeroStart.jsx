import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import video1 from '../assets/ptuvid.mp4';

const Herostart = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-play video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          setIsPlaying(false);
        });
      }
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster="/images/hero-poster.jpg"
        >
          <source src={video1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-8 lg:px-16 xl:px-24 text-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl lg:max-w-3xl xl:max-w-4xl"
          >
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center mb-4"
            >
              <div className="w-12 h-px bg-teal-400 mr-3"></div>
              <span className="text-teal-400 font-medium tracking-wider">PERSONALIZED MENTORSHIP</span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              Accelerate Your <span className="text-teal-400">Career Growth</span> With Expert Guidance
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl md:text-2xl mb-8 font-light max-w-2xl leading-relaxed">
              Connect with industry leaders who will help you navigate your professional journey and unlock your full potential.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-teal-500 hover:bg-teal-600 rounded-lg font-semibold text-lg shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                Find Your Mentor
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:bg-opacity-10 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all"
              >
                How It Works
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="w-8 h-8 rounded-full bg-white border-2 border-teal-400"></div>
                  ))}
                </div>
                <span>Trusted by 10,000+ professionals</span>
              </div>
              <div className="hidden sm:flex items-center">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mr-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span>95% Success Rate</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Video Controls (Desktop Only) */}
      {!isMobile && (
        <div className="absolute bottom-8 right-8 z-20 flex gap-3">
          <button
            onClick={togglePlay}
            className="p-3 bg-black/50 hover:bg-black/70 rounded-full transition backdrop-blur-sm"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <FaPause className="text-white" /> : <FaPlay className="text-white" />}
          </button>
          <button
            onClick={toggleMute}
            className="p-3 bg-black/50 hover:bg-black/70 rounded-full transition backdrop-blur-sm"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <FaVolumeMute className="text-white" /> : <FaVolumeUp className="text-white" />}
          </button>
        </div>
      )}

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2 text-white/80">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-2 bg-white rounded-full mt-2"
            ></motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Herostart;


