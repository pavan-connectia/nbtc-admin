import React, { useState, useEffect } from "react";
import { Input, TextEditor, ButtonGroup, ImageUpload, Modal } from "..";
import {
  usePostCareersInfoMutation,
  useUpdateCareersInfoMutation,
} from "@/redux/api/careersInfo";
import { toast } from "sonner";

const CareersInfoForm = ({ isOpen, onClose, careersInfo }) => {
  const initialState = {
    importNoticeImage: "",
    heading: { en: "", ar: "" },
    description: { en: "", ar: "" },
  };
  const [formData, setFormData] = useState(initialState);

  const [postCareersInfo] = usePostCareersInfoMutation();
  const [updateCareersInfo] = useUpdateCareersInfoMutation();

  useEffect(() => {
    setFormData(careersInfo ? careersInfo : initialState);
  }, [careersInfo]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const [field, lang] = id.split("_");

    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      careersInfo
        ? await updateCareersInfo({ id: careersInfo._id, ...formData }).unwrap()
        : await postCareersInfo(formData).unwrap();

      toast.success(
        `Careers Info ${careersInfo ? "updated" : "created"} successfully`,
      );
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalTitle={"Edit Careers Info"}
      modalDescription="Make changes to the Careers page here. Click save when you're done."
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <ImageUpload
          uploadUrl={"/uploads/careers"}
          imageUrl={formData.importNoticeImage}
          onUploadSuccess={(filePath) =>
            setFormData({ ...formData, importNoticeImage: filePath })
          }
        />

        <Input
          id="heading_en"
          label="Heading (EN)"
          value={formData.heading.en}
          onChange={handleChange}
        />
        <Input
          id="heading_ar"
          label="Heading (AR)"
          value={formData.heading.ar}
          onChange={handleChange}
        />

        <TextEditor
          id="description_en"
          label="Description (EN)"
          value={formData.description.en}
          onChange={(e) =>
            handleChange({ target: { id: "description_en", value: e } })
          }
        />
        <TextEditor
          id="description_ar"
          label="Description (AR)"
          value={formData.description.ar}
          direction="rtl"
          onChange={(e) =>
            handleChange({ target: { id: "description_ar", value: e } })
          }
        />

        <ButtonGroup negativeClick={onClose} />
      </form>
    </Modal>
  );
};

export default CareersInfoForm;
