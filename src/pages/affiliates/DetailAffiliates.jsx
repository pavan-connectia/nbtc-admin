import React from "react";
import { AffiliatesForm } from "@/components";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAffiliateByIdQuery } from "@/redux/api/affiliates";

const DetailAffiliate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = useGetAffiliateByIdQuery(id);

  return (
    <AffiliatesForm onClose={() => navigate(-1)} affiliates={data?.data} />
  );
};

export default DetailAffiliate;
