import React, { useMemo, useRef, useState } from "react";
import { LuEye, LuPlus, LuTrash } from "react-icons/lu";
import {
  Button,
  Card,
  Heading,
  Text,
  CategoryForm,
  DeleteDialog,
} from "../components";
import {
  useDeleteCategoryMutation,
  useGetCategoryQuery,
  useGetCategoryByDepartmentIdQuery,
} from "../redux/api/category";
import { truncate } from "../utils/truncate";
import { BsThreeDots } from "react-icons/bs";
import useClickOutside from "../hooks/useClickOutside";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import SearchInput from "@/components/shared/SearchInput";

const Category = () => {
  const { role, department } = useSelector((state) => state.auth);
  const { data, isLoading, isError } =
    role === "superadmin"
      ? useGetCategoryQuery()
      : useGetCategoryByDepartmentIdQuery(department);
  const [deleteCategory] = useDeleteCategoryMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [openOptionIndex, setOpenOptionIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const optionRefs = useRef(null);

  useClickOutside(optionRefs, () => setOpenOptionIndex(null));

  const toggleOptions = (index) => {
    setOpenOptionIndex(openOptionIndex === index ? null : index);
  };

  const handleView = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteCategory({ id, department: department }).unwrap();
      toast.success("Category deleted successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const filteredData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((d) =>
      d?.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <Heading className="text-xl md:text-2xl">Category</Heading>

        <div className="flex w-full gap-2 md:w-auto">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleAddCategory}>
            <LuPlus />
            Add Category
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Card className="p-5 mt-3 overflow-y-auto">
          <table className="w-full mb-10 border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-2">#</th>
                <th className="p-2">Image</th>
                <th className="p-2">Name</th>
                {role === "superadmin" && <th className="p-2">Department</th>}
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
                      className="object-contain overflow-hidden size-20"
                    />
                  </td>
                  <td className="p-2"> {truncate(d?.name?.en, 30)}</td>
                  {role === "superadmin" && (
                    <td className="p-2">
                      {truncate(d?.department?.name?.en || "", 50)}
                    </td>
                  )}

                  <td className="p-2"> {d?.display ? "Display" : "Hide"}</td>
                  <td className="relative p-2">
                    <button
                      onClick={() => toggleOptions(idx)}
                      aria-label="Options"
                    >
                      <BsThreeDots />
                    </button>
                    {openOptionIndex === idx && (
                      <div
                        className="absolute z-50 p-3 space-y-2 bg-white rounded-lg shadow-lg right-10 top-5"
                        ref={optionRefs}
                      >
                        <button
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => handleView(d)}
                          aria-label="View Category"
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
                          aria-label="Delete Category"
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
          onDelete={() => handleDeleteClick(selectedCategory)}
          isModalOpen={isDeleteOpen}
        />
      )}

      {isModalOpen && (
        <CategoryForm
          isOpen={isModalOpen}
          onClose={() => {
            setSelectedCategory(null);
            setIsModalOpen(false);
          }}
          category={selectedCategory}
        />
      )}
    </>
  );
};

export default Category;
