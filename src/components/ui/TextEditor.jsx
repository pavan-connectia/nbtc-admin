import React, { useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({
  label,
  id,
  value,
  onChange,
  className,
  direction = "ltr",
}) => {
  const quillRef = useRef(null);

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-black">
          {label}
        </label>
      )}
      <ReactQuill
        id={id}
        theme="snow"
        value={value}
        style={{ direction: direction }}
        onChange={onChange}
        className={className}
        ref={quillRef}
      />
    </div>
  );
};
export default TextEditor;
