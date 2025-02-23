import React, { useEffect } from 'react';  // ✅ Import useEffect
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
import MenteeUpdate from './Components/MenteeUpdate';
import MenteeDashboard from './pages/MenteeDashboard';
import MentorDashboard from './pages/MentorDashboard';
import MentorShow from './pages/MentorShow';
import MentorConnection from './pages/MentorConnection';
import MenteeAcceptedReq from './pages/MenteeAcceptedReq';
import VideoCall from './pages/VideoCall';
import MenteeMain from './pages/MenteeMain';
import LogOut from './Components/LogOut';
import SkillAssessment from "./pages/SkillAssessment";
import AOS from "aos";
import "aos/dist/aos.css";

const App = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

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
        <Route path="/mentee-update" element={<MenteeUpdate />} />
        <Route path="/mentor-dashboard" element={<MentorDashboard />} />
        <Route path="/mentee-dashboard" element={<MenteeDashboard />} />
        <Route path="/mentor-show" element={<MentorShow />} />
        <Route path="/video-call" element={<VideoCall />} />
        <Route path="/mentee-main" element={<MenteeMain />} />
        <Route path="/mentor-connection" element={<MentorConnection />} />
        <Route path="/mentee-accepted-req" element={<MenteeAcceptedReq />} />
        <Route path="/skill-assessment" element={<SkillAssessment />} />
        <Route path="/logout" element={<LogOut />} />
      </Routes>
    </Router>
  );
};

export default App;
