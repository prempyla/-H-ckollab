import React from "react";
import "./Loader.css";

const Loader = ({ loading = true, size = 35 }) => {
  if (!loading) return null;
  return (
    <div className="custom-loader-container">
      <div
        className="custom-spinner"
        style={{ width: size, height: size }}
        aria-label="Loading"
      />
    </div>
  );
};

export default Loader;