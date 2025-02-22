import React from "react";
import MenteeA from "../Components/MenteeA"; 
import MenteeAcceptedReq from "../pages/MenteeAcceptedReq";
const MenteeMain = () => {
  return (
    <div className="min-h-screen ">
      <MenteeA />
      <MenteeAcceptedReq/>
    </div>
  );
};

export default MenteeMain;
