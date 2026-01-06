import React from "react";
import { cn } from "@/utils/cn";

const Label = ({ className, children, id, ...props }) => {
  return (
    <label
      htmlFor={id}
      className={cn("text-sm font-medium text-black", className)}
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;
