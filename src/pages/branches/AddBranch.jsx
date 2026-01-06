import React from "react";
import { useNavigate } from "react-router-dom";
import { BranchesForm } from "@/components";

const AddBranch = () => {
  const navigate = useNavigate();
  return <BranchesForm onClose={() => navigate(-1)} />;
};

export default AddBranch;
