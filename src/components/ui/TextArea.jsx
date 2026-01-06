import React from "react";
import { cn } from "@/utils/cn";

const TextArea = ({ label, className, id, rows = 5, ...props }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-black">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        rows={rows}
        {...props}
      />
    </div>
  );
};

export default TextArea;
