import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import sliderImg from '../assets/sliderImage.jpg';
import './Slider.css'; // Ensure custom styles are in the appropriate file

// Custom next and previous button components
const NextArrow = ({ onClick }) => (
  <div
    className="custom-next-arrow"
    style={{
      position: 'absolute',
      bottom: '10px',
      right: '40px',
      zIndex: 2,
      cursor: 'pointer',
    }}
    onClick={onClick}
  >
    ➡️
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="custom-prev-arrow"
    style={{
      position: 'absolute',
      bottom: '10px',
      right: '80px',
      zIndex: 2,
      cursor: 'pointer',
    }}
    onClick={onClick}
  >
    ⬅️
  </div>
);

const mentors = [
  {
    name: 'Jhon Dwirian',
    title: 'UI/UX Design',
    company: 'Grab',
    image: sliderImg, 
  },
  {
    name: 'Leon S Kennedy',
    title: 'Machine Learning',
    company: 'Google',
    image: sliderImg, 
  },
  {
    name: 'Nguyễn Thuy',
    title: 'Android Development',
    company: 'Airbnb',
    image: sliderImg, 
  },
  {
    name: 'Nguyễn Thuy',
    title: 'Android Development',
    company: 'Airbnb',
    image: sliderImg, 
  },
  {
    name: 'Nguyễn Thuy',
    title: 'Android Development',
    company: 'Airbnb',
    image: sliderImg, 
  },
  {
    name: 'Nguyễn Thuy',
    title: 'Android Development',
    company: 'Airbnb',
    image: sliderImg, 
  },
];

const MentorMenteeSpotlight = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true, // Enable automatic sliding
    autoplaySpeed: 3000, // Time between slides (3000ms = 3 seconds)
    nextArrow: <NextArrow />, // Custom next button
    prevArrow: <PrevArrow />, // Custom previous button
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section id="spotlight" className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 ">Our Expert <span className='relative text-[#127c71]'>Mentors<svg className="absolute -top-3 -right-8 w-6 md:w-8 h-auto" viewBox="0 0 3183 3072">
                    <path fill="#127C71" d="M2600 224c0,0 0,0 0,0 236,198 259,562 52,809 -254,303 -1849,2089 -2221,1776 -301,-190 917,-1964 1363,-2496 207,-247 570,-287 806,-89z" />
                    <path fill="#127C71" d="M3166 2190c0,0 0,0 0,0 64,210 -58,443 -270,516 -260,90 -1848,585 -1948,252 -104,-230 1262,-860 1718,-1018 212,-73 437,39 500,250z" />
                    <path fill="#127C71" d="M566 3c0,0 0,0 0,0 -219,-26 -427,134 -462,356 -44,271 -255,1921 90,1962 245,62 628,-1392 704,-1869 36,-221 -114,-424 -332,-449z" />
                </svg></span></h2>

        <Slider {...settings} className="mb-12 custom-slider">
          {mentors.map((mentor, index) => (
            <div key={index} className="slide-item bg-white p-6 rounded-lg shadow-lg hover:scale-105">
              <img
                src={mentor.image}
                alt={mentor.name}
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
              />
              <h4 className="text-xl font-semibold text-primary mb-2">{mentor.name}</h4>
              <p className="text-gray-600 mb-2">{mentor.title}</p>
              <p className="text-gray-800">{mentor.company}</p>
            </div>
          ))}
        </Slider>

      </div>
    </section>
  );
};

export default MentorMenteeSpotlight;
