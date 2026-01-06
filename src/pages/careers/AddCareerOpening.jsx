import { CareersOpeningForm } from "@/components";
import React from "react";
import { useNavigate } from "react-router-dom";

const AddCareerOpening = () => {
  const navigate = useNavigate();
  return <CareersOpeningForm onClose={() => navigate(-1)} />;
};

export default AddCareerOpening;
