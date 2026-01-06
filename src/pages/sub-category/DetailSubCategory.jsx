import React from "react";
import { SubCategoryForm } from "@/components";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSubCategoryByIdQuery } from "@/redux/api/subcategory";

const DetailSubCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = useGetSubCategoryByIdQuery(id);

  return (
    <SubCategoryForm onClose={() => navigate(-1)} equipments={data?.data} />
  );
};

export default DetailSubCategory;
