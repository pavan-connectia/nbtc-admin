import React, { useEffect, useRef, useState } from "react";
import { Label } from "..";
import { useGetCoreBusinessOptionsQuery } from "@/redux/api/coreBusiness";

const MultiDepartmentDD = ({ value = [], onChange }) => {
  const { data } = useGetCoreBusinessOptionsQuery();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const options = data?.data || [];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleValue = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const selectedLabels = options
    .filter((o) => value.includes(o._id))
    .map((o) => o.name.en)
    .join(", ");

  return (
    <div className="relative space-y-1" ref={ref}>
      <Label>Department</Label>

      <div
        className="cursor-pointer rounded-md border px-3 py-2"
        onClick={() => setOpen((p) => !p)}
      >
        {selectedLabels || "Select Departments"}
      </div>

      {open && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-md">
          {options.map((dep) => (
            <label
              key={dep._id}
              className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-100"
            >
              <input
                type="checkbox"
                checked={value.includes(dep._id)}
                onChange={() => toggleValue(dep._id)}
              />
              <span>{dep.name.en}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiDepartmentDD;
