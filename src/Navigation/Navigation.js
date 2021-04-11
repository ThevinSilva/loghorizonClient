import React, { useState, useEffect } from "react";
import Header from "./header.js";
import Sidebar from "./sidebar.js";

const NavBar = () => {
  const [initialActive, setInitialActive] = useState("");
  useEffect(() => {
    let URL = window.location.pathname;
    console.log(`\n ${window.location.pathname} \n`);

    switch (URL.toLowerCase()) {
      default:
        setInitialActive("dashboard");
        break;
      case "/app/profile":
        setInitialActive("profile");
        break;
      case "/app/devlog":
        setInitialActive("devlog");
        break;
    }

    if (/app\/f/.test(URL.toLowerCase()) === true) setInitialActive("friends");
    if (/app\/b/.test(URL.toLowerCase()) === true) setInitialActive("boards");
  }, [window.location.pathname]);

  return (
    <>
      <Header />
      <Sidebar initialActive={initialActive} />
    </>
  );
};

export default NavBar;
