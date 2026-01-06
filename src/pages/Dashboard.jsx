import React from "react";
import { Card, Heading, Text } from "../components";
import { useGetNewsQuery } from "../redux/api/news";
import { useGetCoreBusinessQuery } from "../redux/api/coreBusiness";
import { useGetProjectsQuery } from "../redux/api/projects";
import { useGetSubCategoryQuery } from "@/redux/api/subcategory";

const Dashboard = () => {
  const { data: newsData } = useGetNewsQuery();
  const { data: coreBusinessData } = useGetCoreBusinessQuery();
  const { data: projectsData } = useGetProjectsQuery();
  const { data: equipmentsData } = useGetSubCategoryQuery();

  return (
    <>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[
          { title: "Total News", data: newsData?.data?.length },
          {
            title: "Total Core Business",
            data: coreBusinessData?.data?.length,
          },
          { title: "Total Projects", data: projectsData?.data?.length },
          { title: "Total Equipments", data: equipmentsData?.data?.length },
        ].map((d) => (
          <Card className="space-y-1 p-5" key={d?.title}>
            <Text>{d?.title}</Text>
            <Heading className="text-xl sm:text-2xl md:text-3xl">
              {d?.data}
            </Heading>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
