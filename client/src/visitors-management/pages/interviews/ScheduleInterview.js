import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import InterviewForm from "../interviews/components/InterviewForm";

const ScheduleInterview = () => {
  return (
    <>
      <Sidebar>
        <InterviewForm/>
      </Sidebar>
    </>
  );
};

export default ScheduleInterview;