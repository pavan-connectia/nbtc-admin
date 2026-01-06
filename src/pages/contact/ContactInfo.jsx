import React, { useRef, useState } from "react";
import { LuEye, LuPlus, LuTrash } from "react-icons/lu";
import { Button, Card, Heading, Text, ContactInfoForm } from "@/components";
import {
  useDeleteContactInfoMutation,
  useGetContactInfoQuery,
} from "@/redux/api/contactInfo";
import { truncate } from "@/utils/truncate";
import { BsThreeDots } from "react-icons/bs";
import useClickOutside from "@/hooks/useClickOutside";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ContactInfo = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetContactInfoQuery();
  const [deleteContactInfo] = useDeleteContactInfoMutation();
  const [openOptionIndex, setOpenOptionIndex] = useState(null);
  const [selectedContactInfo, setSelectedContactInfo] = useState(null);
  const optionRefs = useRef([]);

  useClickOutside(optionRefs, () => setOpenOptionIndex(null));

  const toggleOptions = (index) => {
    setOpenOptionIndex(openOptionIndex === index ? null : index);
  };

  const handleDelete = async (id) => {
    try {
      await deleteContactInfo(id).unwrap();
      toast.success("Contact info deleted successfully");
    } catch (error) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <Heading className="text-xl md:text-2xl">Contact Info</Heading>
        <Button onClick={() => navigate("/contact/contact-info/add")}>
          <LuPlus />
          Add Contact Info
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Card className="mt-3 overflow-x-auto p-5">
          <table className="mb-10 w-full border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-2">#</th>
                <th className="p-2">Title</th>
                <th className="p-2">Physical Address</th>
                <th className="p-2">Postal Address</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
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

                  <td className="p-2"> {truncate(d?.title, 30)}</td>
                  <td className="p-2">
                    {d?.physcialAddress
                      ? truncate(d?.physcialAddress, 30)
                      : "-"}
                  </td>
                  <td className="p-2">
                    {d?.postalAddress ? truncate(d?.postalAddress, 30) : "-"}
                  </td>
                  <td className="p-2"> {truncate(d?.email, 30)}</td>

                  <td className="p-2"> {d?.phone}</td>
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
                          onClick={() =>
                            navigate(`/contact/contact-info/${d?._id}`)
                          }
                          aria-label="View ContactInfo"
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
                          aria-label="Delete ContactInfo"
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
    </>
  );
};

export default ContactInfo;
