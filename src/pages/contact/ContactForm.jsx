import React, { useRef, useState } from "react";
import { LuEye, LuTrash } from "react-icons/lu";
import {
  Card,
  Heading,
  Text,
  ContactSubmissionForm,
  Input,
  Button,
} from "@/components";
import {
  useDeleteContactFormMutation,
  useGetContactFormQuery,
} from "@/redux/api/contactForm";
import { truncate } from "@/utils/truncate";
import { BsThreeDots } from "react-icons/bs";
import useClickOutside from "@/hooks/useClickOutside";
import { toast } from "sonner";

const ContactForm = () => {
  const { data, isLoading } = useGetContactFormQuery();
  const [deleteContactForm] = useDeleteContactFormMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openOptionIndex, setOpenOptionIndex] = useState(null);
  const [selectedContactForm, setSelectedContactForm] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const optionRefs = useRef(null);

  useClickOutside(optionRefs, () => setOpenOptionIndex(null));

  const toggleOptions = (index) => {
    setOpenOptionIndex(openOptionIndex === index ? null : index);
  };

  const handleView = (contactForm) => {
    setSelectedContactForm(contactForm);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteContactForm(id).unwrap();
      toast.success("Contact submission deleted successfully");
    } catch (error) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  const handleExport = async () => {
    try {
      const query = new URLSearchParams();
      if (startDate) query.append("startDate", startDate);
      if (endDate) query.append("endDate", endDate);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/contact/contact-form/export?${query.toString()}`,
        {
          method: "GET",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
          
        },
      );

      if (!res.ok) {
        throw new Error("Failed to export file");
      }

      // Convert response to Blob
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // Create temporary link and trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = "contacts_export.xlsx"; // filename
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error exporting file");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-5">
        <Heading className="text-xl md:text-2xl">Contact Form</Heading>

        <div className="flex gap-2">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button onClick={handleExport}>Export Excel</Button>
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
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone No.</th>
                <th className="p-2">Subject</th>
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
                  <td className="p-2">{d?.name}</td>
                  <td className="p-2">{d?.email}</td>
                  <td className="p-2">{d?.phoneNo}</td>
                  <td className="p-2"> {truncate(d?.subject, 30)}</td>
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
                          aria-label="View ContactForm"
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
                          aria-label="Delete ContactForm"
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

      <ContactSubmissionForm
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedContactForm(null);
          setIsModalOpen(false);
        }}
        contactForm={selectedContactForm}
      />
    </>
  );
};

export default ContactForm;
