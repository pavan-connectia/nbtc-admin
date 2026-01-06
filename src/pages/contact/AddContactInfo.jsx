import { ContactInfoForm } from "@/components";
import React from "react";
import { useNavigate } from "react-router-dom";

const AddContactInfo = () => {
  const navigate = useNavigate();
  return <ContactInfoForm onClose={() => navigate(-1)} />;
};

export default AddContactInfo;
