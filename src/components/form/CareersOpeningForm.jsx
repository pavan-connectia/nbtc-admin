import React, { useState, useEffect } from "react";
import { Form, Input, TextArea, Display, ButtonGroup, TextEditor, DepartmentDD } from "..";
import {
  usePostCareersOpeningMutation,
  useUpdateCareersOpeningMutation,
} from "@/redux/api/careersOpening";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const CareersOpeningForm = ({ onClose, careersOpening }) => {
  const { department, role } = useSelector((state) => state.auth);
  console.log("careersOpening", careersOpening);

  const initialState = {
    vacancy: "",
    department: department || undefined,
    startDate: "",
    endDate: "",
    location: { en: "", ar: "" },
    description: { en: "", ar: "" },
    title: { en: "", ar: "" },
    display: true,
  };


  const [formData, setFormData] = useState(initialState);
  const [postCareersOpening] = usePostCareersOpeningMutation();
  const [updateCareersOpening] = useUpdateCareersOpeningMutation();

  useEffect(() => {
    if (careersOpening) {
      setFormData({
        ...careersOpening,
        startDate: careersOpening.startDate
          ? careersOpening.startDate.split("T")[0]
          : "",
        endDate: careersOpening.endDate
          ? careersOpening.endDate.split("T")[0]
          : "",
      });
    } else {
      setFormData(initialState);
    }
  }, [careersOpening]);


  const handleNestedChange = (id, lang, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [lang]: value,
      },
    }));
  };




  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "display") {
      setFormData((prev) => ({ ...prev, display: e.target.value }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      careersOpening
        ? await updateCareersOpening({
          id: careersOpening._id,
          ...formData,
        }).unwrap()
        : await postCareersOpening(formData).unwrap();

      toast.success(
        `Careers Opening ${careersOpening ? "updated" : "created"} successfully`
      );
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };


  return (
    <Form
      formTitle={`${careersOpening ? "Edit" : "New"} Careers Opening`}
      formDescription="Make changes to the Careers opening here. Click save when you're done."
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <TextArea
          id="title"
          label="Title (EN)"
          value={formData.title.en}
          onChange={(e) => handleNestedChange("title", "en", e.target.value)}
        />

        <TextArea
          id="title"
          label="Title (AR)"
          value={formData.title.ar}
          onChange={(e) => handleNestedChange("title", "ar", e.target.value)}
        />

        <Input
          id="location"
          label="Location (EN)"
          value={formData.location.en}
          onChange={(e) => handleNestedChange("location", "en", e.target.value)}
        />

        <Input
          id="location"
          label="Location (AR)"
          value={formData.location.ar}
          onChange={(e) => handleNestedChange("location", "ar", e.target.value)}
        />

        <Input
          id="vacancy"
          label="Vacancy"
          value={formData.vacancy}
          onChange={handleChange}
        />

        <TextEditor
          id="description"
          label="Description (EN)"
          value={formData.description.en}
          onChange={(value) => handleNestedChange("description", "en", value)}
        />

        <TextEditor
          id="description"
          label="Description (AR)"
          value={formData.description.ar}
          onChange={(value) => handleNestedChange("description", "ar", value)}
        />

        {!department && (
          <DepartmentDD
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
          />
        )}



        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="startDate"
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
          />

          <Input
            id="endDate"
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>


        <Display
          id="display"
          label="Display"
          value={formData.display}
          onChange={(val) => setFormData((prev) => ({ ...prev, display: val }))}
        />

        <ButtonGroup negativeClick={onClose} />
      </form>
    </Form>
  );
};

export default CareersOpeningForm;
