import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Mentors from './pages/Mentors';
import Contact from './pages/Contact';
import MentorRegister from "./pages/MentorRegister";
import MenteeRegister from "./pages/MenteeRegister";
import MentorLogin from "./pages/MentorLogin";

const App = () => {
  return (
    <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mentor-register" element={<MentorRegister />} />
          <Route path="/mentor-login" element={<MentorLogin />} />
          <Route path="/mentee-register" element={<MenteeRegister />} />
        </Routes>
    </Router>
  );
};

export default App;
