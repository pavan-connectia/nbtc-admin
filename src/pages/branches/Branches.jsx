import React, { useRef, useState } from "react";
import { LuEye, LuPlus, LuTrash } from "react-icons/lu";
import {
  Button,
  Card,
  Heading,
  Text,
  BranchesForm,
  DeleteDialog,
} from "@/components";
import {
  useDeleteBranchesMutation,
  useGetBranchesQuery,
} from "@/redux/api/branches";
import { BsThreeDots } from "react-icons/bs";
import useClickOutside from "@/hooks/useClickOutside";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Branches = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetBranchesQuery();
  const [deleteBranches] = useDeleteBranchesMutation();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [openOptionIndex, setOpenOptionIndex] = useState(null);
  const [selectedBranches, setSelectedBranches] = useState(null);
  const optionRefs = useRef(null);

  useClickOutside(optionRefs, () => setOpenOptionIndex(null));

  const toggleOptions = (index) => {
    setOpenOptionIndex(openOptionIndex === index ? null : index);
  };

  const handleDelete = (branches) => {
    setSelectedBranches(branches);
    setIsDeleteOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteBranches(id).unwrap();
      toast.success("Branch deleted successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <Heading className="text-xl md:text-2xl">Branches</Heading>
        <Button onClick={() => navigate("/branches/add")}>
          <LuPlus />
          Add Branches
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
                <th className="p-2">Id</th>
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
                  <td className="p-2"> {d?.href}</td>
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
                          onClick={() => navigate(`/branches/${d?.href}`)}
                          aria-label="View Branches"
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
                          aria-label="Delete Branches"
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
          onDelete={() => handleDeleteClick(selectedBranches)}
          isModalOpen={isDeleteOpen}
        />
      )}
    </>
  );
};

export default Branches;
