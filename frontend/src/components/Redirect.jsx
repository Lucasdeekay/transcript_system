// components/Redirect.js
import { useEffect } from "react";
import { useLocation } from "wouter";

const Redirect = ({ to }) => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation(to);
  }, [to, setLocation]);

  return null; // render nothing
};

export default Redirect;
