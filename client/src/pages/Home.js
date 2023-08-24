import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    !user && navigate("/login", { replace: true });
  }, []);

  return (
    <>
      <div className="jumbotron">
        <h1>Welcome {user ? user.name : null}</h1>
        <hr className="my-4" />
        <Link to="/create" className="btn btn-primary">
          Create Contact
        </Link>
        &nbsp;&nbsp;
        <Link to="/mycontacts" className="btn btn-primary">
          mycontacts
        </Link>
      </div>
    </>
  );
}

export default Home;
