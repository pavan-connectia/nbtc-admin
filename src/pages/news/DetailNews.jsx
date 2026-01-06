import { NewsForm } from "@/components";
import { useGetNewsByIdQuery } from "@/redux/api/news";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const DetailNews = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = useGetNewsByIdQuery(id);

  return <NewsForm onClose={() => navigate(-1)} news={data?.data} />;
};

export default DetailNews;
