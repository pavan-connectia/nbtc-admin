import React, { useRef } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import { cn } from "@/utils/cn";

const OptionDD = ({
  options,
  isOpen,
  onClose,
  positionClass = "right-10 top-5",
}) => {
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => onClose());

  if (!isOpen) return null;

  const defaultClass = cn(
    "absolute z-50 p-3 space-y-2 bg-white rounded-lg shadow-lg",
    positionClass,
  );

  return (
    <div ref={dropdownRef} className={defaultClass}>
      {options.map((option, idx) => (
        <button
          key={idx}
          onClick={option.onClick}
          aria-label={option.label}
          className="flex cursor-pointer items-center gap-3"
        >
          {option.icon}
          <span className="text-sm font-medium text-black">{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default OptionDD;
