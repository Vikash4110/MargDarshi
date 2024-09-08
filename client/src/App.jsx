import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Mentors from './pages/Mentors';
import Contact from './pages/Contact';

const App = () => {
  return (
    <Router>
     <div>
     
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
