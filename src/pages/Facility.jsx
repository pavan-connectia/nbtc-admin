import React, { useRef, useState } from "react";
import { LuEye, LuPlus, LuTrash } from "react-icons/lu";
import {
  Button,
  Card,
  Heading,
  Text,
  FacilityForm,
  DeleteDialog,
} from "@/components";
import {
  useDeleteFacilityMutation,
  useGetFacilityByDepartmentIdQuery,
  useGetFacilityQuery,
} from "@/redux/api/facility";
import { truncate } from "@/utils/truncate";
import { truncateHtml } from "@/utils/truncateHtml";
import { BsThreeDots } from "react-icons/bs";
import useClickOutside from "@/hooks/useClickOutside";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Facility = () => {
  const { role, department } = useSelector((state) => state.auth);
  const { data, isLoading } =
    role === "superadmin"
      ? useGetFacilityQuery()
      : useGetFacilityByDepartmentIdQuery(department);

  const [deleteFacility] = useDeleteFacilityMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [openOptionIndex, setOpenOptionIndex] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const optionRefs = useRef(null);

  useClickOutside(optionRefs, () => setOpenOptionIndex(null));

  const toggleOptions = (index) => {
    setOpenOptionIndex(openOptionIndex === index ? null : index);
  };

  const handleView = (facility) => {
    setSelectedFacility(facility);
    setIsModalOpen(true);
  };

  const handleDelete = (project) => {
    setSelectedFacility(project);
    setIsDeleteOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteFacility(id).unwrap();
      toast.success("Facility deleted successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  const handleAddFacility = () => {
    setSelectedFacility(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <Heading className="text-xl md:text-2xl">Facility</Heading>
        <Button onClick={handleAddFacility}>
          <LuPlus />
          Add Facility
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
                <th className="p-2">Image</th>
                <th className="p-2">Title</th>
                <th className="p-2">Description</th>
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
                  <td className="p-2">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${d?.image}`}
                      alt=""
                      className="size-20 overflow-hidden object-contain"
                    />
                  </td>
                  <td className="p-2"> {truncate(d?.title?.en, 30)}</td>
                  <td className="p-2">
                    {truncateHtml(d?.description?.en, 30)}
                  </td>
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
                          onClick={() => handleView(d)}
                          aria-label="View Facility"
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
                          onClick={() => handleDelete({ id: d?._id })}
                          aria-label="Delete Facility"
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

      {isDeleteOpen && (
        <DeleteDialog
          onCancel={() => setIsDeleteOpen(false)}
          onDelete={() => handleDeleteClick(selectedFacility)}
          isModalOpen={isDeleteOpen}
        />
      )}

      {isModalOpen && (
        <FacilityForm
          isOpen={isModalOpen}
          onClose={() => {
            setSelectedFacility(null);
            setIsModalOpen(false);
          }}
          facility={selectedFacility}
        />
      )}
    </>
  );
};

export default Facility;
