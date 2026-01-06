import React from "react";
import { SubCategoryForm } from "@/components";
import { useNavigate } from "react-router-dom";

const AddSubCategory = () => {
  const navigate = useNavigate();
  return (
    <div>
      <SubCategoryForm onClose={() => navigate(-1)} />
    </div>
  );
};

export default AddSubCategory;
