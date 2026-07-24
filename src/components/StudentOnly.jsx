import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const StudentOnly = ({ children }) => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const isStudent = userData?.prefs?.role === "student";

  useEffect(() => {
    if (!isStudent) navigate("/student/login", { replace: true });
  }, [isStudent, navigate]);

  return isStudent ? children : null;
};

export default StudentOnly;
