import React, { useMemo, useRef, useState } from "react";
import { LuEye, LuPlus, LuTrash } from "react-icons/lu";
import {
  Button,
  Card,
  Heading,
  Text,
  ClientsForm,
  DeleteDialog,
} from "../components";
import {
  useDeleteClientsMutation,
  useGetClientsQuery,
} from "../redux/api/clients";
import { truncate } from "../utils/truncate";
import { BsThreeDots } from "react-icons/bs";
import useClickOutside from "../hooks/useClickOutside";
import { toast } from "sonner";
import SearchInput from "@/components/shared/SearchInput";

const Clients = () => {
  const { data, isLoading } = useGetClientsQuery();
  const [deleteClients] = useDeleteClientsMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [openOptionIndex, setOpenOptionIndex] = useState(null);
  const [selectedClients, setSelectedClients] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const optionRefs = useRef(null);

  useClickOutside(optionRefs, () => setOpenOptionIndex(null));

  const toggleOptions = (index) => {
    setOpenOptionIndex(openOptionIndex === index ? null : index);
  };

  const handleView = (clients) => {
    setSelectedClients(clients);
    setIsModalOpen(true);
  };

  const handleDelete = (client) => {
    setSelectedClients(client);
    setIsDeleteOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteClients(id).unwrap();
      toast.success("Client deleted successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  const handleAddClients = () => {
    setSelectedClients(null);
    setIsModalOpen(true);
  };

  const filteredData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((d) =>
      d?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <Heading className="text-xl md:text-2xl">Clients</Heading>

        <div className="flex w-full gap-2 md:w-auto">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleAddClients}>
            <LuPlus />
            Add Clients
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
                <th className="p-2">Display</th>
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
                  <td className="p-2"> {truncate(d?.name, 30)}</td>
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
                          aria-label="View Clients"
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
                          aria-label="Delete Clients"
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
          onDelete={() => handleDeleteClick(selectedClients)}
          isModalOpen={isDeleteOpen}
        />
      )}

      {isModalOpen && (
        <ClientsForm
          isOpen={isModalOpen}
          onClose={() => {
            setSelectedClients(null);
            setIsModalOpen(false);
          }}
          clients={selectedClients}
        />
      )}
    </>
  );
};

export default Clients;
