import React, { useMemo, useRef, useState } from "react";
import { LuEye, LuPlus, LuTrash } from "react-icons/lu";
import { Button, Card, Heading, Text, ImgGalleryForm } from "@/components";
import {
  useDeleteImgGalleryMutation,
  useGetImgGalleryByDepartmentQuery,
  useGetImgGalleryQuery,
} from "@/redux/api/imgGallery";
import { truncate } from "@/utils/truncate";
import { BsThreeDots } from "react-icons/bs";
import useClickOutside from "@/hooks/useClickOutside";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import SearchInput from "@/components/shared/SearchInput";

const ImgGallery = () => {
  const { role, department } = useSelector((state) => state.auth);
  const { data, isLoading } =
    role === "superadmin"
      ? useGetImgGalleryQuery()
      : useGetImgGalleryByDepartmentQuery(department);
  const [deleteImgGallery] = useDeleteImgGalleryMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openOptionIndex, setOpenOptionIndex] = useState(null);
  const [selectedImgGallery, setSelectedImgGallery] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const optionRefs = useRef(null);

  useClickOutside(optionRefs, () => setOpenOptionIndex(null));

  const toggleOptions = (index) => {
    setOpenOptionIndex(openOptionIndex === index ? null : index);
  };

  const handleView = (imgGallery) => {
    setSelectedImgGallery(imgGallery);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteImgGallery({
        id: id,
        department: role !== "superadmin" ? department : undefined,
      }).unwrap();
      toast.success("Image Gallery deleted successfully");
    } catch (error) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  const handleAddImgGallery = () => {
    setSelectedImgGallery(null);
    setIsModalOpen(true);
  };

  const filteredData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((d) =>
      d?.title?.en?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <Heading className="text-xl md:text-2xl">Image Gallery</Heading>

        <div className="flex w-full gap-2 md:w-auto">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleAddImgGallery}>
            <LuPlus />
            Add Image Gallery
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
                <th className="p-2">Title</th>
                <th className="p-2">Department</th>
                <th className="p-2">Display</th>
                <th className="p-2">Show In Main</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((d, idx) => (
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
                  <td className="p-2"> {truncate(d?.title?.en, 30)}</td>
                  <td className="p-2"> {d?.department?.name?.en}</td>
                  <td className="p-2">{d?.display ? "Display" : "Hide"}</td>
                  <td className="p-2">{d?.showInMain ? "Display" : "Hide"}</td>
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
                          aria-label="View ImgGallery"
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
                          aria-label="Delete ImgGallery"
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

      <ImgGalleryForm
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedImgGallery(null);
          setIsModalOpen(false);
        }}
        imgGallery={selectedImgGallery}
      />
    </>
  );
};

export default ImgGallery;
