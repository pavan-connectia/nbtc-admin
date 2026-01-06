import React, { useState, useEffect } from "react";
import { Modal, Input, Display, ButtonGroup, TextEditor } from "..";
import {
  usePostEventMutation,
  useUpdateEventMutation,
} from "@/redux/api/event";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const EventForm = ({ isOpen, onClose, event }) => {
  const { department } = useSelector((state) => state.auth);
  const initialState = {
    title: { en: "", ar: "" },
    description: { en: "", ar: "" },
    display: true,
  };
  const [formData, setFormData] = useState(initialState);

  const [postEvent] = usePostEventMutation();
  const [updateEvent] = useUpdateEventMutation();

  useEffect(() => {
    setFormData(event ? event : initialState);
  }, [event]);

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
    const payload = { ...formData };

    if (department) {
      payload.department = department;
    }
    try {
      event
        ? await updateEvent({ id: event._id, ...payload }).unwrap()
        : await postEvent(payload).unwrap();

      toast.success(`Event ${event ? "updated" : "saved"}  successfully`);
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      modalTitle={`${event ? "Edit" : "New"} Event`}
      modalDescription="Make changes to the event here. Click save when you're done."
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

        <TextEditor
          id="description"
          label="Description (EN)"
          value={formData.description.en}
          onChange={(e) => handleNestedChange("description", "en", e)}
        />

        <TextEditor
          id="description"
          label="Description (AR)"
          value={formData.description.ar}
          onChange={(e) => handleNestedChange("description", "ar", e)}
        />

        <Display
          value={formData.display}
          onChange={(val) => setFormData((prev) => ({ ...prev, display: val }))}
        />

        <ButtonGroup negativeClick={onClose} positiveClick={handleSubmit} />
      </form>
    </Modal>
  );
};

export default EventForm;
