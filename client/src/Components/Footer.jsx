import React from 'react';
import { motion } from 'framer-motion';
import { FaTwitter, FaFacebook, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.section
      className="py-12 bg-[#127C71] text-white sm:py-16 lg:py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={sectionVariants}
    >
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
          {/* Brand Section */}
          <motion.div className="space-y-6" variants={sectionVariants}>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="bg-purple-500 w-5 h-5 rounded-full shadow-md"></div>
                <div className="bg-blue-500 w-3 h-3 rounded-full shadow-md"></div>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">MentorConnect</span>
            </div>
            <p className="text-base leading-relaxed text-gray-200">
              Connecting mentees with expert mentors to guide your career journey effectively.
            </p>
            <ul className="flex items-center space-x-4">
              {[FaTwitter, FaFacebook, FaInstagram, FaGithub].map((Icon, index) => (
                <motion.li key={index} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <a
                    href="#"
                    className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full transition-all duration-300 hover:bg-teal-500"
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company Section */}
          <motion.div variants={sectionVariants}>
            <p className="text-sm font-semibold tracking-widest text-gray-200 uppercase">Company</p>
            <ul className="mt-6 space-y-4">
              {['About', 'Mentors', 'Contact'].map((item, index) => (
                <motion.li key={index} variants={listItemVariants} whileHover={{ x: 5 }}>
                  <a href="#" className="text-base text-gray-100 hover:text-teal-200 hover:underline">
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Help Section */}
          <motion.div variants={sectionVariants}>
            <p className="text-sm font-semibold tracking-widest text-gray-200 uppercase">Help</p>
            <ul className="mt-6 space-y-4">
              {['Customer Support', 'Delivery Details', 'Terms & Conditions', 'Privacy Policy'].map(
                (item, index) => (
                  <motion.li key={index} variants={listItemVariants} whileHover={{ x: 5 }}>
                    <a href="#" className="text-base text-gray-100 hover:text-teal-200 hover:underline">
                      {item}
                    </a>
                  </motion.li>
                )
              )}
            </ul>
          </motion.div>

          {/* Resources Section */}
          <motion.div variants={sectionVariants}>
            <p className="text-sm font-semibold tracking-widest text-gray-200 uppercase">Resources</p>
            <ul className="mt-6 space-y-4">
              {['Blog', 'Guides', 'Webinars', 'FAQs'].map((item, index) => (
                <motion.li key={index} variants={listItemVariants} whileHover={{ x: 5 }}>
                  <a href="#" className="text-base text-gray-100 hover:text-teal-200 hover:underline">
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Divider and Copyright */}
        <motion.hr
          className="mt-12 mb-8 border-gray-300"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <motion.p className="text-sm text-center text-gray-200" variants={sectionVariants}>
          © {new Date().getFullYear()}, All Rights Reserved by MentorConnect
        </motion.p>
      </div>
    </motion.section>
  );
};

export default Footer;
