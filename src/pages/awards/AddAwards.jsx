import React from "react";
import { useNavigate } from "react-router-dom";
import { AwardsForm } from "@/components";

const AddAward = () => {
  const navigate = useNavigate();
  return <AwardsForm onClose={() => navigate(-1)} />;
};

export default AddAward;
