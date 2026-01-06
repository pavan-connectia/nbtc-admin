import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  ImageUpload,
  Index,
  Display,
  ButtonGroup,
  Select,
} from "..";
import {
  usePostQualificationMutation,
  useUpdateQualificationMutation,
} from "@/redux/api/qualification";
import { useGetQualificationLocQuery } from "@/redux/api/qualificationLoc";
import { toast } from "sonner";

const QualificationForm = ({ isOpen, onClose, qualification }) => {
  const [postQualification] = usePostQualificationMutation();
  const [updateQualification] = useUpdateQualificationMutation();
  const { data } = useGetQualificationLocQuery();

  const initialState = {
    image: "",
    name: { en: "", ar: "" },
    location: "",
    display: true,
    index: 0,
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    setFormData(qualification ? qualification : initialState);
  }, [qualification]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleLocationChange = (e) => {
    setFormData({ ...formData, location: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      qualification
        ? await updateQualification({
            id: qualification._id,
            ...formData,
          }).unwrap()
        : await postQualification(formData).unwrap();

      toast.success(
        `Qualification ${qualification ? "updated" : "created"} successfully`,
      );
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      modalTitle={`${qualification ? "Edit" : "New"} Qualification`}
      modalDescription="Make changes to the qualification here. Click save when you're done."
      onClose={onClose}
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <Input
          id="name.en"
          label="Name (EN)"
          value={formData.name.en}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: { ...formData.name, en: e.target.value },
            })
          }
        />

        <Input
          id="name.ar"
          label="Name (AR)"
          value={formData.name.ar}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: { ...formData.name, ar: e.target.value },
            })
          }
        />

        <ImageUpload
          imageUrl={formData?.image}
          title={formData.name.en}
          uploadUrl={"/uploads/qualification"}
          onUploadSuccess={(filePath) =>
            setFormData({ ...formData, image: filePath })
          }
        />

        <Select
          id="location"
          value={formData.location}
          onChange={handleLocationChange}
          options={
            data?.data?.map((d) => ({
              key: d?.key,
              value: d?.key,
              label: d?.name?.en,
            })) || []
          }
          placeholder="Select a location"
        />

        <Display value={formData.display}   onChange={(val) => setFormData((prev) => ({ ...prev, display: val }))} />

        <Index value={formData.index} onChange={handleChange} />

        <ButtonGroup negativeClick={onClose} />
      </form>
    </Modal>
  );
};

export default QualificationForm;
