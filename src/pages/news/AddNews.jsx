import { NewsForm } from "@/components";
import React from "react";
import { useNavigate } from "react-router-dom";

const AddNews = () => {
  const navigate = useNavigate();
  return <NewsForm onClose={() => navigate(-1)} />;
};

export default AddNews;
