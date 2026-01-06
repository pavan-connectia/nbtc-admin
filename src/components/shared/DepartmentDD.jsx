import React from "react";
import { Label, Select } from "..";
import { useGetCoreBusinessOptionsQuery } from "@/redux/api/coreBusiness";

const DepartmentDD = ({ value, onChange }) => {
  const { data } = useGetCoreBusinessOptionsQuery();

  return (
    <div className="space-y-1">
      <Label id={"department"}>Department</Label>
      <Select
        id={"department"}
        value={value}
        onChange={onChange}
        options={data?.data?.map((d) => ({
          key: d?._id,
          value: d?._id,
          label: d?.name?.en,
        }))}
      />
    </div>
  );
};

export default DepartmentDD;
