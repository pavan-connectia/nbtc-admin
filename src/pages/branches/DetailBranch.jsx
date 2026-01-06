import React from "react";
import { BranchesForm } from "@/components";
import { useNavigate, useParams } from "react-router-dom";
import { useGetBranchByNameQuery } from "@/redux/api/branches";

const DetailAward = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = useGetBranchByNameQuery(id);

  return <BranchesForm onClose={() => navigate(-1)} branches={data?.data} />;
};

export default DetailAward;
