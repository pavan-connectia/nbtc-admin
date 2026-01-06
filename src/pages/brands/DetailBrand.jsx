import React from "react";
import { BrandsForm } from "@/components";
import { useNavigate, useParams } from "react-router-dom";
import { useGetBrandByIdQuery } from "@/redux/api/brands";

const DetailBrand = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = useGetBrandByIdQuery(id);

  return <BrandsForm onClose={() => navigate(-1)} brands={data?.data} />;
};

export default DetailBrand;
