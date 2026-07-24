import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const TeacherOnly = ({ children }) => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const isStudent = userData?.prefs?.role === "student";

  useEffect(() => {
    if (isStudent) navigate("/teachers", { replace: true });
  }, [isStudent, navigate]);

  return isStudent ? null : children;
};

export default TeacherOnly;
