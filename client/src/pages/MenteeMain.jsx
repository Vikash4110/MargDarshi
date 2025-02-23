import React from "react";
import MenteeA from "../Components/MenteeA"; 
import MenteeAcceptedReq from "../pages/MenteeAcceptedReq";
import MenteeD from '../Components/MenteeD';
import JobMenteeDashboard from '../pages/JobMenteeDashboard';
import MenteeBlogs from "../pages/MenteeBlogs";
const MenteeMain = () => {
  return (
    <div className="min-h-screen ">
      <MenteeA />
      <MenteeAcceptedReq/>
      <MenteeD/>
     <JobMenteeDashboard/>
     <MenteeBlogs/>
    </div>
  );
};

export default MenteeMain;
