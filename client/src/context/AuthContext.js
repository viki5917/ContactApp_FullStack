import { createContext, useContext, useEffect, useState } from "react";
import ToastContext from "./ToastContext";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { toast } = useContext(ToastContext);

  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  //check if the user logged in
  const checkUserLoggedIn = async () => {
    try {
      const res = await fetch(
        "https://contactapp-backend.onrender.com/api/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const result = await res.json();

      if (!result.error) {
        if (
          location.pathname === "/login" ||
          location.pathname === "/register"
        ) {
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 100);
        } else {
          navigate(location.pathname ? location.pathname : "/");
        }
        setUser(result);
      } else {
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.log(err);
    }
  };

  //login request
  const loginUser = async (userData) => {
    try {
      const res = await fetch(
        `https://contactapp-backend.onrender.com/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({ ...userData }),
        }
      );
      const result = await res.json();
      if (!result.error) {
        localStorage.setItem("token", result.token);
        setUser(result.user);
        toast.success(`Successfully logged in ${result.user.name}`);
        navigate("/", { replace: true });
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //register request
  const registerUser = async (userData) => {
    try {
      const res = await fetch(
        `https://contactapp-backend.onrender.com/api/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({ ...userData }),
        }
      );
      const result = await res.json();
      if (!result.error) {
        toast.success("User registered successfully");
        navigate("/login", { replace: true });
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthContext.Provider value={{ loginUser, registerUser, setUser, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
