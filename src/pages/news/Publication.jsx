import React, { useRef, useState } from "react";
import { LuEye, LuPlus, LuTrash } from "react-icons/lu";
import { Button, Card, Heading, Text, PublicationForm } from "@/components";
import {
  useDeletePublicationMutation,
  useGetPublicationByDepartmentQuery,
  useGetPublicationQuery,
} from "@/redux/api/publication";
import { truncate } from "@/utils/truncate";
import { BsThreeDots } from "react-icons/bs";
import useClickOutside from "@/hooks/useClickOutside";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Publication = () => {
  const { role, department } = useSelector((state) => state.auth);
  const { data, isLoading } =
    role === "superadmin"
      ? useGetPublicationQuery()
      : useGetPublicationByDepartmentQuery(department);
  const [deletePublication] = useDeletePublicationMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openOptionIndex, setOpenOptionIndex] = useState(null);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const optionRefs = useRef(null);

  useClickOutside(optionRefs, () => setOpenOptionIndex(null));

  const toggleOptions = (index) => {
    setOpenOptionIndex(openOptionIndex === index ? null : index);
  };

  const handleView = (publication) => {
    setSelectedPublication(publication);
    setIsModalOpen(true);
  };


  const handleDelete = async (id) => {
    try {
      await deletePublication(id).unwrap();
      toast.success("Publication deleted successfully");
    } catch (error) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  const handleAddPublication = () => {
    setSelectedPublication(null);
    setIsModalOpen(true);
  };

  console.log("Publication Data:", data);

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <Heading className="text-xl md:text-2xl">Publication</Heading>
        <Button onClick={handleAddPublication}>
          <LuPlus />
          Add Publication
        </Button>
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
                <th className="p-2">Department</th>
                <th className="p-2">Date</th>
                <th className="p-2">Display</th>
                <th className="p-2">Show In Main</th>
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
                  <td className="p-2">{truncate(d?.title || "No Title", 30)}</td>
                  <td className="p-2">{truncate(d?.department?.name?.en || "", 20)}</td>
                  <td className="p-2">{d?.date}</td>
                  <td className="p-2">{d?.display ? "Yes" : "No"}</td>
                  <td className="p-2">{d?.showInMain ? "Yes" : "No"}</td>

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
                          onClick={() => handleView(d)}
                          aria-label="View Publication"
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
                          aria-label="Delete Publication"
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

      <PublicationForm
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedPublication(null);
          setIsModalOpen(false);
        }}
        publication={selectedPublication}
      />

    </>
  );
};

export default Publication;
