import React, { useRef, useState } from "react";
import { LuEye, LuPlus, LuTrash } from "react-icons/lu";
import {
  Button,
  Card,
  Heading,
  Text,
  MailingListDeptForm,
  DeleteDialog,
} from "../components";
import { BsThreeDots } from "react-icons/bs";
import useClickOutside from "../hooks/useClickOutside";
import { toast } from "sonner";
import {
  useGetMailingListDeptQuery,
  useDeleteMailingListDeptMutation,
} from "@/redux/api/mailinglistDept";
import { useSelector } from "react-redux";

const MailingList = () => {
  const { department } = useSelector((state) => state.auth);
  const { data, isLoading } = useGetMailingListDeptQuery(department);
  const [deleteMailingList] = useDeleteMailingListDeptMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [openOptionIndex, setOpenOptionIndex] = useState(null);
  const [selectedMailingList, setSelectedMailingList] = useState(null);
  const optionRefs = useRef(null);

  useClickOutside(optionRefs, () => setOpenOptionIndex(null));

  const toggleOptions = (index) => {
    setOpenOptionIndex(openOptionIndex === index ? null : index);
  };

  const handleView = (mailingList) => {
    setSelectedMailingList(mailingList);
    setIsModalOpen(true);
  };

  const handleDelete = (mailingList) => {
    setSelectedMailingList(mailingList);
    setIsDeleteOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteMailingList(id).unwrap();
      toast.success("MailingList deleted successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  const handleAddMailingList = () => {
    setSelectedMailingList(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <Heading className="text-xl md:text-2xl">MailingList</Heading>
        <Button onClick={handleAddMailingList}>
          <LuPlus />
          Add Mailing List
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
                <th className="p-2">Email</th>
                <th className="p-2">Tag</th>
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

                  <td className="p-2"> {d?.email}</td>
                  <td className="p-2"> {d?.tag}</td>
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
                          aria-label="View MailingList"
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
                          aria-label="Delete MailingList"
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
          onDelete={() => handleDeleteClick(selectedMailingList)}
          isModalOpen={isDeleteOpen}
        />
      )}

      {isModalOpen && (
        <MailingListDeptForm
          isOpen={isModalOpen}
          onClose={() => {
            setSelectedMailingList(null);
            setIsModalOpen(false);
          }}
          mailinglist={selectedMailingList}
        />
      )}
    </>
  );
};

export default MailingList;
