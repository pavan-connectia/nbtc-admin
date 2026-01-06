import React from "react";
import { useNavigate } from "react-router-dom";
import { BrandsForm } from "@/components";

const AddBrand = () => {
  const navigate = useNavigate();
  return <BrandsForm onClose={() => navigate(-1)} />;
};

export default AddBrand;
