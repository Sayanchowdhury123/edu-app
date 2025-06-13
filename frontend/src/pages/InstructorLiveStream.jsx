
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { Authcontext } from "../context/Authcontext";
import axiosinstance from "../api";

const InstructorLiveStream = () => {
  const location = useLocation()
  const { courseId } = location.state || {};
  const {user} = useContext(Authcontext)

  return (
  <div>

  </div>
  );
};

export default InstructorLiveStream;
