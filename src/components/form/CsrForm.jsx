import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  TextEditor,
  ImageUpload,
  Index,
  Display,
  ButtonGroup,
} from "..";
import { usePostCsrMutation, useUpdateCsrMutation } from "@/redux/api/csr";
import { toast } from "sonner";

const CsrForm = ({ isOpen, onClose, csr }) => {
  const initialState = {
    image: "",
    title: { en: "", ar: "" },
    description: { en: "", ar: "" },
    display: true,
    index: 0,
  };
  const [formData, setFormData] = useState(initialState);

  const [postCsr] = usePostCsrMutation();
  const [updateCsr] = useUpdateCsrMutation();

  useEffect(() => {
    setFormData(csr ? csr : initialState);
  }, [csr]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const newValue = id === "display" ? value === "true" : value;
    setFormData((prev) => ({ ...prev, [id]: newValue }));
  };

  const handleNestedChange = (id, lang, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [lang]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      csr
        ? await updateCsr({
            id: csr._id,
            ...formData,
          }).unwrap()
        : await postCsr(formData).unwrap();

      toast.success(`Csr ${csr ? "updated" : "created"} successfully`);
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      modalTitle={`${csr ? "Edit" : "New"} Csr`}
      modalDescription="Make changes to the csr here. Click save when you're done."
      onClose={onClose}
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <Input
          id="title"
          label="Title (EN)"
          value={formData.title.en}
          onChange={(e) => handleNestedChange("title", "en", e.target.value)}
        />
        <Input
          id="title"
          label="Title (AR)"
          value={formData.title.ar}
          onChange={(e) => handleNestedChange("title", "ar", e.target.value)}
        />

        <ImageUpload
          imageUrl={formData.image}
          uploadUrl={"/uploads/csr"}
          title={formData.title.en}
          onUploadSuccess={(filePath) =>
            setFormData({ ...formData, image: filePath })
          }
        />

        <TextEditor
          label="Description (EN)"
          id="description"
          value={formData.description.en}
          onChange={(value) =>
            setFormData({
              ...formData,
              description: { ...formData.description, en: value },
            })
          }
        />

        <TextEditor
          label="Description (AR)"
          id="description"
          value={formData.description.ar}
          onChange={(value) =>
            setFormData({
              ...formData,
              description: { ...formData.description, ar: value },
            })
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

export default CsrForm;
