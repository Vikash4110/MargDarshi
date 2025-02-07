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
import MenteeLogin from "./pages/MenteeLogin";
import MentorUser from "./pages/MentorUser";
import MentorUpdate from "./Components/MentorUpdate";
import MenteeUser from './pages/MenteeUser';
import LogOut from './Components/LogOut';
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
          <Route path="/mentee-login" element={<MenteeLogin />} />
          <Route path="/mentor-user" element={<MentorUser />} />
          <Route path="/mentee-user" element={<MenteeUser />} />
          <Route path="/mentor-update" element={<MentorUpdate />} />
          <Route path="/logout" element={<LogOut />} />
        </Routes>
    </Router>
  );
};

export default App;
