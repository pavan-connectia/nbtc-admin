import React from "react";
import { cn } from "@/utils/cn";

const Heading = ({ as = "h2", children, className, ...props }) => {
  const Tag = as;

  return (
    <Tag
      className={cn("font-bold text-accent-foreground", className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Heading;
