import React, { useRef, useState, useMemo } from "react";
import { LuEye, LuPlus, LuTrash } from "react-icons/lu";
import {
  Button,
  Card,
  Heading,
  Text,
  ServiceForm,
  DeleteDialog,
  Input,
} from "@/components"; // assuming Input exists in your components
import {
  useDeleteServiceMutation,
  useGetServiceByDepartmentIdQuery,
  useGetServiceQuery,
} from "@/redux/api/service";
import { truncate } from "@/utils/truncate";
import { truncateHtml } from "@/utils/truncateHtml";
import { BsThreeDots } from "react-icons/bs";
import useClickOutside from "@/hooks/useClickOutside";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import SearchInput from "@/components/shared/SearchInput";

const Service = () => {
  const { role, department } = useSelector((state) => state.auth);
  const { data, isLoading } =
    role === "superadmin"
      ? useGetServiceQuery()
      : useGetServiceByDepartmentIdQuery(department);

  const [deleteService] = useDeleteServiceMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [openOptionIndex, setOpenOptionIndex] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const optionRefs = useRef(null);
  useClickOutside(optionRefs, () => setOpenOptionIndex(null));

  const toggleOptions = (index) => {
    setOpenOptionIndex(openOptionIndex === index ? null : index);
  };

  const handleView = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDelete = (project) => {
    setSelectedService(project);
    setIsDeleteOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteService(id).unwrap();
      toast.success("Service deleted successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  const handleAddService = () => {
    setSelectedService(null);
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
      <div className="flex flex-col w-full gap-3 md:flex-row md:items-center md:justify-between">
        <Heading className="text-xl md:text-2xl">Service</Heading>
        <div className="flex w-full gap-2 md:w-auto">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleAddService}>
            <LuPlus />
            Add Service
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
                <th className="p-2">Description</th>
                <th className="p-2">Department</th>
                <th className="p-2">Display</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((d, idx) => (
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
                    <td className="p-2">
                      {truncateHtml(d?.description?.en, 30)}
                    </td>
                    <td className="p-2">{d?.department?.name?.en}</td>
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
                          className="absolute z-50 p-3 space-y-2 bg-white rounded-lg shadow-lg right-10 top-5"
                          ref={optionRefs}
                        >
                          <button
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => handleView(d)}
                            aria-label="View Service"
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
                            aria-label="Delete Service"
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
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No services found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}

      {isDeleteOpen && (
        <DeleteDialog
          onCancel={() => setIsDeleteOpen(false)}
          onDelete={() => handleDeleteClick(selectedService)}
          isModalOpen={isDeleteOpen}
        />
      )}

      {isModalOpen && (
        <ServiceForm
          isOpen={isModalOpen}
          onClose={() => {
            setSelectedService(null);
            setIsModalOpen(false);
          }}
          service={selectedService}
        />
      )}
    </>
  );
};

export default Service;
