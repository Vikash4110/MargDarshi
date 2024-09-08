import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import MentorRegister from "./pages/MentorRegister"
const App = () => {

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<MentorRegister />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
