import React, { useEffect, useState } from "react";

const NotFound = () => {
  const [canvas, setCanvas] = useState(false);
  useEffect(() => {
    let path = window.location.pathname.split("/");
    if (path.findIndex((x) => x === "f" || x === "b")) setCanvas(true);
  }, []);

  return (
    <div className={`${canvas ? "canvas-list" : "canvas"}  center`}>
      <h1 style={{ marginBottom: "0", marginTop: "30vh", fontSize: "10rem" }}>
        404
      </h1>
      <span>OOPS! PAGE NOT FOUND</span>
    </div>
  );
};

export default NotFound;
