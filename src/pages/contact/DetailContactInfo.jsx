import React from "react";
import { ContactInfoForm } from "@/components";
import { useNavigate, useParams } from "react-router-dom";
import { useGetContactInfoByIdQuery } from "@/redux/api/contactInfo";

const DetailContactInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useGetContactInfoByIdQuery(id);

  return (
    <ContactInfoForm onClose={() => navigate(-1)} contactInfo={data?.data} />
  );
};

export default DetailContactInfo;
