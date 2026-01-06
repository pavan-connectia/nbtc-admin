import React, { useRef, useState } from "react";
import { LuEye, LuPlus, LuTrash } from "react-icons/lu";
import {
  Button,
  Card,
  Heading,
  Text,
  MilestonesForm,
  DeleteDialog,
} from "../components";
import {
  useDeleteMilestonesMutation,
  useGetMilestonesQuery,
} from "../redux/api/milestones";
import { truncate } from "../utils/truncate";
import { BsThreeDots } from "react-icons/bs";
import useClickOutside from "../hooks/useClickOutside";
import { toast } from "sonner";

const Milestones = () => {
  const { data, isLoading } = useGetMilestonesQuery();
  const [deleteMilestones] = useDeleteMilestonesMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [openOptionIndex, setOpenOptionIndex] = useState(null);
  const [selectedMilestones, setSelectedMilestones] = useState(null);
  const optionRefs = useRef(null);

  useClickOutside(optionRefs, () => setOpenOptionIndex(null));

  const toggleOptions = (index) => {
    setOpenOptionIndex(openOptionIndex === index ? null : index);
  };

  const handleView = (milestones) => {
    setSelectedMilestones(milestones);
    setIsModalOpen(true);
  };

  const handleDelete = (milestone) => {
    setSelectedMilestones(milestone);
    setIsDeleteOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteMilestones(id).unwrap();
      toast.success("Milestones deleted successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  const handleAddMilestones = () => {
    setSelectedMilestones(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <Heading className="text-xl md:text-2xl">Milestones</Heading>
        <Button onClick={handleAddMilestones}>
          <LuPlus />
          Add Milestones
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
                <th className="p-2">Year</th>
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
                  <td className="p-2"> {truncate(d?.title?.en || "", 30)}</td>
                  <td className="p-2"> {d?.year}</td>
                  <td className="p-2">
                    {" "}
                    {truncate(d?.description?.en || "", 30)}
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
                          aria-label="View Milestones"
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
                          aria-label="Delete Milestones"
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
          onDelete={() => handleDeleteClick(selectedMilestones)}
          isModalOpen={isDeleteOpen}
        />
      )}

      {isModalOpen && (
        <MilestonesForm
          isOpen={isModalOpen}
          onClose={() => {
            setSelectedMilestones(null);
            setIsModalOpen(false);
          }}
          milestones={selectedMilestones}
        />
      )}
    </>
  );
};

export default Milestones;
