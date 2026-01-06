import React from "react";
import { useNavigate } from "react-router-dom";
import { CoreBusinessForm } from "@/components";

const AddCoreBusiness = () => {
  const navigate = useNavigate();
  return <CoreBusinessForm onClose={() => navigate(-1)} />;
};

export default AddCoreBusiness;
