import React from "react";
import { AwardsForm } from "@/components";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAwardByIdQuery } from "@/redux/api/awards";

const DetailAward = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = useGetAwardByIdQuery(id);

  return <AwardsForm onClose={() => navigate(-1)} awards={data?.data} />;
};

export default DetailAward;
