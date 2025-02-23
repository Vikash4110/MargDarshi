import React from "react";
import MenteeA from "../Components/MenteeA"; 
import MenteeAcceptedReq from "../pages/MenteeAcceptedReq";
import MenteeD from '../Components/MenteeD'
const MenteeMain = () => {
  return (
    <div className="min-h-screen ">
      <MenteeA />
      <MenteeAcceptedReq/>
      <MenteeD/>
    </div>
  );
};

export default MenteeMain;
