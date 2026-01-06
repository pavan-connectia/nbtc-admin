import React, { useRef, useState } from "react";
import { LuEye, LuTrash } from "react-icons/lu";
import {
  Card,
  Heading,
  Text,
  QuotationForm,
  DeleteDialog,
} from "../components";
import {
  useDeleteQuotationMutation,
  useGetQuotationByDepartmentIdQuery,
  useGetQuotationQuery,
} from "../redux/api/quotation";
import { truncate } from "../utils/truncate";
import { BsThreeDots } from "react-icons/bs";
import useClickOutside from "../hooks/useClickOutside";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Quotation = () => {
  const { role, department } = useSelector((state) => state.auth);
  const { data, isLoading } =
    role === "superadmin"
      ? useGetQuotationQuery()
      : useGetQuotationByDepartmentIdQuery(department);

  const [deleteQuotation] = useDeleteQuotationMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [openOptionIndex, setOpenOptionIndex] = useState(null);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const optionRefs = useRef(null);

  useClickOutside(optionRefs, () => setOpenOptionIndex(null));

  const toggleOptions = (index) => {
    setOpenOptionIndex(openOptionIndex === index ? null : index);
  };

  const handleView = (quotation) => {
    setSelectedQuotation(quotation);
    setIsModalOpen(true);
  };

  const handleDelete = (quotation) => {
    setSelectedQuotation(quotation);
    setIsDeleteOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteQuotation({
        id: id,
        department: role !== "superadmin" ? department : undefined,
      }).unwrap();
      toast.success("Quotation deleted successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <Heading className="text-xl md:text-2xl">Quotation</Heading>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Card className="mt-3 overflow-y-auto p-5">
          <table className="mb-10 w-full border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-2">#</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Message</th>
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

                  <td className="p-2"> {truncate(d?.name, 30)}</td>
                  <td className="p-2"> {d?.email}</td>
                  <td className="p-2"> {d?.phone}</td>
                  <td className="p-2"> {truncate(d?.message, 30)}</td>

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
                          aria-label="View Quotation"
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
                          aria-label="Delete Quotation"
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
          onDelete={() => handleDeleteClick(selectedQuotation)}
          isModalOpen={isDeleteOpen}
        />
      )}

      {isModalOpen && (
        <QuotationForm
          isOpen={isModalOpen}
          onClose={() => {
            setSelectedQuotation(null);
            setIsModalOpen(false);
          }}
          quotation={selectedQuotation}
        />
      )}
    </>
  );
};

export default Quotation;
