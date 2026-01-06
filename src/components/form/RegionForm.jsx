import React, { useState, useEffect } from "react";
import { Input, ImageUpload, ButtonGroup, TextEditor, Modal } from "..";
import { toast } from "sonner";
import {
  usePostRegionMutation,
  useUpdateRegionMutation,
} from "@/redux/api/region";

const RegionForm = ({ onClose, region, isOpen }) => {
  const initialState = {
    name: {
      en: "",
      ar: "",
    },
    image: "",
    href: "",
    description: {
      en: "",
      ar: "",
    },
    seo: {
      title: "",
      metaDescription: "",
      metaKeywords: "",
      ogImage: "",
      ogUrl: "",
      canonicalUrl: "",
    },
  };

  const [formData, setFormData] = useState(initialState);
  const [postRegion] = usePostRegionMutation();
  const [updateRegion] = useUpdateRegionMutation();

  useEffect(() => {
    setFormData(region ? region : initialState);
  }, [region]);

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
      region
        ? await updateRegion({ id: region._id, ...formData }).unwrap()
        : await postRegion(formData).unwrap();

      toast.success(`Region ${region ? "updated" : "saved"} successfully`);
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalTitle={`${region ? "Edit" : "New"} Region`}
      modalDescription="Make changes to the region here. Click save when you're done."
    >
      <modal className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <Input
          id="name"
          label="Name (EN)"
          value={formData.name?.en || ""}
          onChange={(e) => handleNestedChange("name", "en", e.target.value)}
        />

        <Input
          id="name"
          label="Name (AR)"
          value={formData.name?.ar || ""}
          onChange={(e) => handleNestedChange("name", "ar", e.target.value)}
        />

        <Input
          id="href"
          label="Href"
          value={formData.href || ""}
          onChange={(e) => handleChange(e)}
        />

        <ImageUpload
          uploadUrl={"/uploads/regions"}
          title={formData.name.en}
          imageUrl={formData.image}
          onUploadSuccess={(filePath) =>
            setFormData({ ...formData, image: filePath })
          }
        />

        <TextEditor
          id="description-en"
          label="Description (EN)"
          value={formData.description.en || ""}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              description: { ...prev.description, en: value },
            }))
          }
        />

        <TextEditor
          id="description-ar"
          label="Description (AR)"
          value={formData.description.ar || ""}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              description: { ...prev.description, ar: value },
            }))
          }
        />

        <ButtonGroup negativeClick={onClose} positiveClick={handleSubmit} />
      </modal>
    </Modal>
  );
};

export default RegionForm;
