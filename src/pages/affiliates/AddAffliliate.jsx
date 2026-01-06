import React from "react";
import { useNavigate } from "react-router-dom";
import { AffiliatesForm } from "@/components";

const AddAffiliate = () => {
  const navigate = useNavigate();
  return <AffiliatesForm onClose={() => navigate(-1)} />;
};

export default AddAffiliate;
