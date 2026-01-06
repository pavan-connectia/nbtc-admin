import React from "react";

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  id,
}) => {
  return (
    <div className={`relative inline-block w-full ${className}`}>
      <select
        value={value}
        onChange={onChange}
        id={id}
        className="flex w-full px-3 py-2 text-sm border border-gray-500 rounded-md h-9 bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {placeholder && !value && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}

        {options.map((option, idx) => (
          <option key={idx} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
