import React, { useState, useEffect } from "react";
import { Modal, Input, ImageUpload, TextArea, ButtonGroup, Display } from "..";
import {
  usePostMilestonesDeptMutation,
  useUpdateMilestonesDeptMutation,
} from "@/redux/api/milestonesDept";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const MilestonesDeptForm = ({ isOpen, onClose, milestones }) => {
  const { department } = useSelector((state) => state.auth);
  const initialState = {
    image: "",
    title: { en: "", ar: "" },
    year: null,
    description: { en: "", ar: "" },
    display: true,
    department: department || "",
  };
  const [formData, setFormData] = useState(initialState);

  const [postMilestones] = usePostMilestonesDeptMutation();
  const [updateMilestones] = useUpdateMilestonesDeptMutation();

  useEffect(() => {
    setFormData(milestones ? milestones : initialState);
  }, [milestones]);

  const handleChange = (e) => {
    const { id, value } = e.target;

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      milestones
        ? await updateMilestones({
            id: milestones._id,
            ...formData,
          }).unwrap()
        : await postMilestones(formData).unwrap();

      toast.success(
        `Milestone ${milestones ? "updated" : "created"} successfully`,
      );
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

        <TextArea
          label="Description (EN)"
          id="description-en"
          name="description"
          value={formData.description.en}
          onChange={handleChange}
        />

        <TextArea
          label="Description (AR)"
          id="description-ar"
          name="description"
          value={formData.description.ar}
          onChange={handleChange}
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

export default MilestonesDeptForm;
