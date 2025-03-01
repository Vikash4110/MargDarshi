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
import MenteeMain from './pages/MenteeMain';
import LogOut from './Components/LogOut';
import SkillAssessment from "./pages/SkillAssessment";
import PostJob from "./pages/PostJob";
import JobMenteeDashboard from "./pages/JobMenteeDashboard";
import MentorJobApplicants from './pages/MentorJobApplicants';
import MenteeApplications from './pages/MenteeApplications';
import MenteeBlogs from './pages/MenteeBlogs';
import MentorBlogs from './pages/MentorBlogs';


import AdminRegister from "./pages/AdminRegister";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
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
        <Route path="/mentee-main" element={<MenteeMain />} />
        <Route path="/mentor-connection" element={<MentorConnection />} />
        <Route path="/mentee-accepted-req" element={<MenteeAcceptedReq />} />
        <Route path="/skill-assessment" element={<SkillAssessment />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/job-mentee-dashboard" element={<JobMenteeDashboard />} />
        <Route path="/mentor-job-applicants/:jobId" element={<MentorJobApplicants />} />
        <Route path="/mentee-applications" element={<MenteeApplications />} />
        <Route path="/mentor-blogs" element={<MentorBlogs />} />
        <Route path="/mentee-blogs" element={<MenteeBlogs />} />
        <Route path="/logout" element={<LogOut />} />

        {/* Admin Logics */}
        <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
