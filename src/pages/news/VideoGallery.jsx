import React, { useRef, useState } from "react";
import { LuEye, LuPlus, LuTrash } from "react-icons/lu";
import { Button, Card, Heading, Text, VideoGalleryForm } from "@/components";
import {
  useDeleteVideoGalleryMutation,
  useGetVideoGalleryByDepartmentQuery,
  useGetVideoGalleryQuery,
} from "@/redux/api/videGallery";
import { truncate } from "@/utils/truncate";
import { BsThreeDots } from "react-icons/bs";
import useClickOutside from "@/hooks/useClickOutside";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export default function VideoGallery() {  const { role, department } = useSelector((state) => state.auth);
  const { data, isLoading } =
    role === "superadmin"
      ? useGetVideoGalleryQuery()
      : useGetVideoGalleryByDepartmentQuery(department);
  const [deleteVideoGallery] = useDeleteVideoGalleryMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openOptionIndex, setOpenOptionIndex] = useState(null);
  const [selectedVideoGallery, setSelectedVideoGallery] = useState(null);
  const optionRefs = useRef(null);

  useClickOutside(optionRefs, () => setOpenOptionIndex(null));

  const toggleOptions = (index) => {
    setOpenOptionIndex(openOptionIndex === index ? null : index);
  };

  const handleView = (csr) => {
    setSelectedVideoGallery(csr);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteVideoGallery(id).unwrap();
      toast.success("VideoGallery deleted successfully");
    } catch (error) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  const handleAddVideoGallery = () => {
    setSelectedVideoGallery(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <Heading className="text-xl md:text-2xl">Video Gallery</Heading>
        <Button onClick={handleAddVideoGallery}>
          <LuPlus />
          Add Video Gallery
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
                <th className="p-2">link</th>
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
                  <td className="p-2">{truncate(d?.title?.en, 30)}</td>
                  <td className="p-2">{truncate(d?.video, 30)}</td>
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
                        className="absolute right-10 top-5 z-50 space-y-2 rounded-lg bg-white p-3 shadow-lg"
                        ref={optionRefs}
                      >
                        <button
                          className="flex cursor-pointer items-center gap-3"
                          onClick={() => handleView(d)}
                          aria-label="View VideoGallery"
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
                          aria-label="Delete VideoGallery"
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

      <VideoGalleryForm
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedVideoGallery(null);
          setIsModalOpen(false);
        }}
        videoGallery={selectedVideoGallery}
      />
    </>
  );
};


