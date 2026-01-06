import React, { useRef, useState } from "react";
import { LuEye, LuPlus, LuTrash } from "react-icons/lu";
import {
  Button,
  Card,
  Heading,
  Text,
  CoreBusinessForm,
  DeleteDialog,
} from "@/components";
import {
  useDeleteCoreBusinessMutation,
  useGetCoreBusinessByIdQuery,
  useGetCoreBusinessQuery,
} from "@/redux/api/coreBusiness";
import { truncate } from "@/utils/truncate";
import { BsThreeDots } from "react-icons/bs";
import useClickOutside from "@/hooks/useClickOutside";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CoreBusiness = () => {
  const navigate = useNavigate();
  const { role, department } = useSelector((state) => state.auth);

  const { data, isLoading, isError } =
    role === "superadmin"
      ? useGetCoreBusinessQuery() // Fetch all data for superadmin
      : useGetCoreBusinessByIdQuery(department); // Fetch by department for admins

  const [deleteCoreBusiness] = useDeleteCoreBusinessMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [openOptionIndex, setOpenOptionIndex] = useState(null);
  const [selectedCoreBusiness, setSelectedCoreBusiness] = useState(null);
  const optionRefs = useRef(null);

  useClickOutside(optionRefs, () => setOpenOptionIndex(null));

  const toggleOptions = (index) => {
    setOpenOptionIndex(openOptionIndex === index ? null : index);
  };

  const handleDelete = (coreBusiness) => {
    setSelectedCoreBusiness(coreBusiness);
    setIsDeleteOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteCoreBusiness({
        id: id,
        department: department || undefined,
        role: role,
      }).unwrap();
      toast.success("CoreBusiness deleted successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  const res = role === "superadmin" ? data?.data || [] : [data?.data];

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <Heading className="text-xl md:text-2xl">CoreBusiness</Heading>
        {role === "superadmin" && (
          <Button onClick={() => navigate(`/core-business/add`)}>
            <LuPlus />
            Add CoreBusiness
          </Button>
        )}
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Card className="p-5 mt-3 overflow-y-auto">
          <table className="w-full mb-10 border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-2">#</th>
                <th className="p-2">Banner</th>
                <th className="p-2">Name</th>
                <th className="p-2">Link</th>
                <th className="p-2">Projects</th>
                <th className="p-2">Core Business</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {res.map((d, idx) => (
                <tr
                  key={d?._id || idx}
                  className="border-b hover:bg-gray-100 dark:hover:bg-neutral-600"
                >
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${d?.banner}`}
                      alt=""
                      className="object-contain overflow-hidden size-20"
                    />
                  </td>
                  <td className="p-2"> {truncate(d?.name?.en || "", 30)}</td>
                  <td className="p-2"> {d?.href}</td>
                  <td className="p-2">
                    {d?.displayProjects ? "Show" : "Hide"}
                  </td>
                  <td className="p-2">
                    {d?.displayCoreBusiness ? "Show" : "Hide"}
                  </td>

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
                          onClick={() => navigate(`/core-business/${d?._id}`)}
                          aria-label="View CoreBusiness"
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
                          aria-label="Delete CoreBusiness"
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
          onDelete={() => handleDeleteClick(selectedCoreBusiness)}
          isModalOpen={isDeleteOpen}
        />
      )}

      {isModalOpen && (
        <CoreBusinessForm
          isOpen={isModalOpen}
          onClose={() => {
            setSelectedCoreBusiness(null);
            setIsModalOpen(false);
          }}
          coreBusiness={selectedCoreBusiness}
        />
      )}
    </>
  );
};

export default CoreBusiness;
