import React, { useState, useEffect } from "react";
import { Modal, Input, ImageUpload, Index, Display, ButtonGroup } from "..";
import {
  usePostClientsMutation,
  useUpdateClientsMutation,
} from "@/redux/api/clients";
import { toast } from "sonner";

const ClientsForm = ({ isOpen, onClose, clients, index }) => {
  const initialState = {
    image: "",
    name: "",
    display: true,
    index: index,
  };
  const [formData, setFormData] = useState(initialState);

  const [postClients] = usePostClientsMutation();
  const [updateClients] = useUpdateClientsMutation();

  useEffect(() => {
    setFormData(clients ? clients : initialState);
  }, [clients]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const newValue = id === "display" ? value === "true" : value;
    setFormData((prev) => ({ ...prev, [id]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      clients
        ? await updateClients({ id: clients._id, ...formData }).unwrap()
        : await postClients(formData).unwrap();

      toast.success(`Client  ${clients ? "updated" : "created"} successfully`);
      setFormData(initialState);
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      modalTitle={`${clients ? "Edit" : "New"} Client`}
      modalDescription="Make changes to the client here. Click save when you're done."
      onClose={onClose}
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <Input
          id="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <ImageUpload
          imageUrl={formData.image}
          uploadUrl={"/uploads/clients"}
          title={formData.title}
          onUploadSuccess={(filePath) =>
            setFormData({ ...formData, image: filePath })
          }
        />

        <Display
          value={formData.display}
          onChange={(val) => setFormData((prev) => ({ ...prev, display: val }))}
        />

        <Index value={formData.index} onChange={handleChange} />

        <ButtonGroup negativeClick={onClose} />
      </form>
    </Modal>
  );
};

export default ClientsForm;
