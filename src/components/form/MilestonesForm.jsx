import React, { useState, useEffect } from "react";
import { Modal, Input, ImageUpload, TextArea, ButtonGroup, Display, TextEditor } from "..";
import {
  usePostMilestonesMutation,
  useUpdateMilestonesMutation,
} from "@/redux/api/milestones";
import { toast } from "sonner";

const MilestonesForm = ({ isOpen, onClose, milestones }) => {
  const initialState = {
    image: "",
    title: { en: "", ar: "" },
    year: null,
    description: { en: "", ar: "" },
    display: true,
  };
  const [formData, setFormData] = useState(initialState);

  const [postMilestones] = usePostMilestonesMutation();
  const [updateMilestones] = useUpdateMilestonesMutation();

  useEffect(() => {
    setFormData(milestones ? milestones : initialState);
  }, [milestones]);

  // 1. Unified function to handle state updates
  const updateValue = (id, value) => {
    if (id.includes("title") || id.includes("description")) {
      const [key, lang] = id.split("-");
      setFormData((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          [lang]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  // 2. Standard handler for Inputs (Event-based)
  const handleChange = (e) => {
    const { id, value } = e.target;
    updateValue(id, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      milestones
        ? await updateMilestones({ id: milestones._id, ...formData }).unwrap()
        : await postMilestones(formData).unwrap();

      toast.success(`Milestone ${milestones ? "updated" : "created"} successfully`);
      setFormData(initialState);
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      modalTitle={`${milestones ? "Edit" : "New"} Milestone`}
      modalDescription="Make changes to the milestone here. Click save when you're done."
      onClose={onClose}
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <Input
          id="year"
          label="Year"
          value={formData.year}
          onChange={handleChange}
        />

        <Input
          id="title-en"
          name="title"
          label="Title (EN)"
          value={formData.title.en}
          onChange={handleChange}
        />

        <Input
          id="title-ar"
          name="title"
          label="Title (AR)"
          value={formData.title.ar}
          onChange={handleChange}
        />

        <ImageUpload
          uploadUrl={"/uploads/milestones"}
          title={formData.title.en}
          imageUrl={formData.image}
          onUploadSuccess={(filePath) =>
            setFormData({ ...formData, image: filePath })
          }
        />

        {/* 3. Updated TextEditor to pass value directly */}
        <TextEditor
          label="Description (EN)"
          id="description-en"
          name="description"
          value={formData.description.en}
          onChange={(content) => updateValue("description-en", content)}
        />

        <TextEditor
          label="Description (AR)"
          id="description-ar"
          name="description"
          value={formData.description.ar}
          onChange={(content) => updateValue("description-ar", content)}
        />

        <Display
          value={formData.display}
          onChange={(val) => setFormData((prev) => ({ ...prev, display: val }))}
        />

        <ButtonGroup negativeClick={onClose} />
      </form>
    </Modal>
  );
};

export default MilestonesForm;