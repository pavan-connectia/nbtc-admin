import React from "react";
import { CoreBusinessForm } from "@/components";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCoreBusinessByIdQuery } from "@/redux/api/coreBusiness";

const DetailCoreBusiness = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = useGetCoreBusinessByIdQuery(id);

  return (
    <CoreBusinessForm onClose={() => navigate(-1)} coreBusiness={data?.data} />
  );
};

export default DetailCoreBusiness;
