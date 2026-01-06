import React, { useRef, useState } from "react";
import { LuEye, LuPlus, LuTrash } from "react-icons/lu";
import {
  Button,
  Card,
  Heading,
  Text,
  DeleteDialog,
  RegionAwardsForm,
} from "@/components";
import { truncate } from "@/utils/truncate";
import { BsThreeDots } from "react-icons/bs";
import useClickOutside from "@/hooks/useClickOutside";
import { toast } from "sonner";
import {
  useDeleteRegionAwardsMutation,
  useGetRegionAwardsQuery,
} from "@/redux/api/regionAwards";

const RegionAwards = () => {
  const { data, isLoading } = useGetRegionAwardsQuery();
  const [deleteAwards] = useDeleteRegionAwardsMutation();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openOptionIndex, setOpenOptionIndex] = useState(null);
  const [selectedAwards, setSelectedAwards] = useState(null);
  const optionRefs = useRef(null);

  useClickOutside(optionRefs, () => setOpenOptionIndex(null));

  const toggleOptions = (index) => {
    setOpenOptionIndex(openOptionIndex === index ? null : index);
  };

  const handleView = (awards) => {
    setSelectedAwards(awards);
    setIsModalOpen(true);
  };

  const handleDelete = (awards) => {
    setSelectedAwards(awards);
    setIsDeleteOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteAwards(id).unwrap();
      toast.success("Award deleted successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <Heading className="text-xl md:text-2xl">Region Awards</Heading>
        <Button onClick={() => setIsModalOpen(true)}>
          <LuPlus />
          Add Region Awards
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
                <th className="p-2">Name</th>
                <th className="p-2">Region</th>
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
                  <td className="p-2"> {truncate(d?.name?.en || "", 30)}</td>
                  <td className="p-2"> {d?.region}</td>
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
                          aria-label="View Awards"
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
                          aria-label="Delete Awards"
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

      <DeleteDialog
        onCancel={() => setIsDeleteOpen(false)}
        onDelete={() => handleDeleteClick(selectedAwards)}
        isModalOpen={isDeleteOpen}
      />

      {isModalOpen && (
        <RegionAwardsForm
          isOpen={isModalOpen}
          onClose={() => {
            setSelectedAwards(null);
            setIsModalOpen(false);
          }}
          awards={selectedAwards}
        />
      )}
    </>
  );
};

export default RegionAwards;
