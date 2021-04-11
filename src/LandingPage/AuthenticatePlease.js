import React, { useState } from "react";
import * as BsIcons from "react-icons/bs";
const NotFound = () => {
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
    console.log("done");
  }, 3000);

  return loading ? (
    <div className="main-loader"></div>
  ) : (
    <div className="center-align red accent-2" style={{ height: "100vh" }}>
      <BsIcons.BsShieldLock style={{ fontSize: "40vh", marginTop: "20vh" }} />
      <h2>Authenticate First Please</h2>
    </div>
  );
};

export default NotFound;
