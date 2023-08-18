import Router from "next/router";
import { useState, useEffect } from "react";
import useStore from "./store";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { setToken } =  useStore((state) => ({
      setToken: (token) => state.setToken(token),
    }));

    const [verified, setVerified] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem("token");
      const status = localStorage.getItem("status");
      if (!token) {
        setToken(null);
        Router.replace("/login");
      } else {
        setToken(token);
        setVerified(true);

        if (status === "pending") {
          Router.push("/profile-update");
        }
      }
    }, []);

    if (verified) {
      return <WrappedComponent {...props} />;
    } else {
      return null;
    }
  };
};

export default withAuth;
