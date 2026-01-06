
import React from "react";
import { Input } from "..";
import { LuSearch } from "react-icons/lu";

export default function SearchInput({
  placeholder = "Search by title...",
  value,
  onChange,
}) {
  return (
    <div className="flex items-center gap-2 pl-2 border border-gray-500 rounded-md">
    <LuSearch/>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full md:w-64 focus:outline-none"
      />
      </div>
  );
}
