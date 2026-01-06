import React, { useState, useEffect } from "react";
import { Modal, Input, ButtonGroup } from "..";
import {
  usePostQualificationLocMutation,
  useUpdateQualificationLocMutation,
} from "@/redux/api/qualificationLoc";
import { toast } from "sonner";

const QualificationLocForm = ({ isOpen, onClose, qualificationLoc }) => {
  const initialState = {
    key: "",
    name: {
      en: "",
      ar: "",
    },
  };

  const [formData, setFormData] = useState(initialState);

  const [postQualificationLoc] = usePostQualificationLocMutation();
  const [updateQualificationLoc] = useUpdateQualificationLocMutation();

  useEffect(() => {
    setFormData(qualificationLoc ? qualificationLoc : initialState);
  }, [qualificationLoc]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      qualificationLoc
        ? await updateQualificationLoc({
            id: qualificationLoc._id,
            ...formData,
          }).unwrap()
        : await postQualificationLoc(formData).unwrap();

      toast.success(
        `Qualification Location ${
          qualificationLoc ? "updated" : "created"
        } successfully`,
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
      modalTitle={`${qualificationLoc ? "Edit" : "New"} Qualification Location`}
      modalDescription="Make changes to the qualification location here. Click save when you're done."
      onClose={onClose}
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <Input
          id="key"
          label="Key"
          value={formData.key}
          onChange={handleChange}
          placeholder="eg.nbtc-kuwait"
        />

        <Input
          id="nameEn"
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
          id="nameAr"
          label="Name (AR)"
          value={formData.name.ar}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: { ...formData.name, ar: e.target.value },
            })
          }
        />

        <ButtonGroup negativeClick={onClose} />
      </form>
    </Modal>
  );
};

export default QualificationLocForm;
