import React from "react";

const Logo = ({ variant = "sm" }) => {
  const variants = {
    sm: "w-32 h-12",
  };
  return (
    <img
      src={"/logo.png"}
      alt="logo"
      className={`object-contain ${variants[variant]}`}
    />
  );
};

export default Logo;
