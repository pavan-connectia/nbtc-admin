import { CareersOpeningForm } from "@/components";
import { useGetCareersOpeningByIdQuery } from "@/redux/api/careersOpening";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const DetailCareerOpening = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = useGetCareersOpeningByIdQuery(id);

  return (
    <CareersOpeningForm
      careersOpening={data?.data}
      onClose={() => navigate(-1)}
    />
  );
};

export default DetailCareerOpening;
