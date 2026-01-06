import React, { useRef, useState } from "react";
import { LuEye, LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import { Button, Card, Heading, Text, CareersInfoForm } from "@/components";
import {
  useDeleteCareersOpeningMutation,
  useGetCareersOpeningByDepartmentQuery,
  useGetCareersOpeningQuery,
} from "@/redux/api/careersOpening";
import { truncate } from "@/utils/truncate";
import { BsThreeDots } from "react-icons/bs";
import useClickOutside from "@/hooks/useClickOutside";
import { toast } from "sonner";
import { useGetCareersInfoQuery } from "@/redux/api/careersInfo";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CareersOpening = () => {
  const navigate = useNavigate();
  const { role, department } = useSelector((state) => state.auth);
  const { data, isLoading } =
    role === "superadmin"
      ? useGetCareersOpeningQuery()
      : useGetCareersOpeningByDepartmentQuery(department);
  const { data: careerInfo } = useGetCareersInfoQuery();
  const [deleteCareersOpening] = useDeleteCareersOpeningMutation();
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [openOptionIndex, setOpenOptionIndex] = useState(null);
  const [selectedCareersInfo, setSelectedCareersInfo] = useState(null);
  const optionRefs = useRef(null);

  useClickOutside(optionRefs, () => setOpenOptionIndex(null));

  const toggleOptions = (index) => {
    setOpenOptionIndex(openOptionIndex === index ? null : index);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCareersOpening(id).unwrap();
      toast.success("Careers opening deleted successfully");
    } catch (error) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  const handleEditCareer = () => {
    setSelectedCareersInfo(careerInfo?.data);
    setIsModal2Open(true);
  };

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <Heading className="text-xl md:text-2xl">Careers Opening</Heading>

        <div className="flex flex-wrap gap-3">
          {role === "superadmin" && (
            <Button variant="outline" onClick={handleEditCareer}>
              <LuPencil />
              Edit Career Page
            </Button>
          )}

          <Button onClick={() => navigate("/careers/careers-opening/add")}>
            <LuPlus />
            Add Careers Opening
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Card className="mt-3 overflow-y-auto p-5">
          <table className="mb-10 w-full border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-2">#</th>
                <th className="p-2">Title</th>
                <th className="p-2">Location</th>
                <th className="p-2">Department</th>
                <th className="p-2">Vacancy</th>
                <th className="p-2">Display</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((d, idx) => (
                <tr
                  key={d?._id || idx}
                  className="border-b hover:bg-gray-100 dark:hover:bg-neutral-600"
                >
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2"> {truncate(d?.title?.en || "", 30)}</td>
                  <td className="p-2"> {d?.location?.en || ""}</td>
                  <td className="p-2"> {truncate(d?.department?.name?.en || "", 30)}</td>
                  <td className="p-2"> {d?.vacancy}</td>
                  <td className="p-2">{d?.display ? "Display" : "Hide"}</td>
                  <td className="relative p-2">
                    <button
                      onClick={() => toggleOptions(idx)}
                      aria-label="Options"
                    >
                      <BsThreeDots />
                    </button>
                    {openOptionIndex === idx && (
                      <div
                        className="absolute right-10 top-5 z-50 space-y-2 rounded-lg bg-white p-3 shadow-lg"
                        ref={optionRefs}
                      >
                        <button
                          className="flex cursor-pointer items-center gap-3"
                          onClick={() =>
                            navigate(`/careers/careers-opening/${d?._id}`)
                          }
                          aria-label="View CareersOpening"
                        >
                          <LuEye />
                          <Text
                            as="span"
                            className="text-sm font-medium text-black"
                          >
                            View
                          </Text>
                        </button>
                        <button
                          className="flex items-center gap-3"
                          onClick={() => handleDelete(d?._id)}
                          aria-label="Delete Careers Opening"
                        >
                          <LuTrash />
                          <Text
                            as="span"
                            className="text-sm font-medium text-black"
                          >
                            Delete
                          </Text>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <CareersInfoForm
        isOpen={isModal2Open}
        onClose={() => setIsModal2Open(false)}
        careersInfo={selectedCareersInfo}
      />
    </>
  );
};

export default CareersOpening;
