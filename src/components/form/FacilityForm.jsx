import React, { useState, useEffect } from "react";
import {
  Modal,
  Heading,
  Input,
  ImageUpload,
  Display,
  ButtonGroup,
  Index,
  DepartmentDD,
  TextEditor,
  SEOForm,
  Button,
} from "..";
import {
  usePostFacilityMutation,
  useUpdateFacilityMutation,
} from "@/redux/api/facility";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { LuTrash } from "react-icons/lu";

const FacilityForm = ({ isOpen, onClose, facility }) => {
  const { department } = useSelector((state) => state.auth);
  const initialState = {
    image: "",
    title: { en: "", ar: "" },
    description: { en: "", ar: "" },
    department: department || "",
    photos: [],
    display: true,
    index: 0,
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

  const [postFacility] = usePostFacilityMutation();
  const [updateFacility] = useUpdateFacilityMutation();

  useEffect(() => {
    setFormData(facility ? facility : initialState);
  }, [facility]);

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

  const handlePhotosChange = (index, imageUrl) => {
    setFormData((prev) => {
      const updatedPhotos = [...prev.photos];
      updatedPhotos[index] = imageUrl; // Replaces null placeholder with actual image URL
      return { ...prev, photos: updatedPhotos };
    });
  };

  const handleRemovePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleAddPhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, null],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };

    if (department) {
      payload.department = department;
    }
    try {
      facility
        ? await updateFacility({ id: facility._id, ...payload }).unwrap()
        : await postFacility(payload).unwrap();

      toast.success(`Facility ${facility ? "updated" : "saved"}  successfully`);
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      modalTitle={`${facility ? "Edit" : "New"} Facility`}
      modalDescription="Make changes to the facility here. Click save when you're done."
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
          uploadUrl={"/uploads/facility"}
          title={formData.title.en}
          imageUrl={formData.image}
          onUploadSuccess={(filePath) =>
            setFormData({ ...formData, image: filePath })
          }
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

        {!department && (
          <DepartmentDD
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
          />
        )}

        <Heading>Photos</Heading>
        {formData?.photos.map((photo, idx) => (
          <div key={idx} className="flex items-center w-full gap-5">
            <ImageUpload
              imageUrl={photo}
              uploadUrl={"/uploads/facility"}
              className="w-full"
              onUploadSuccess={(imageUrl) => handlePhotosChange(idx, imageUrl)}
            />
            <Button onClick={() => handleRemovePhoto(idx)} className="mb-5">
              <LuTrash />
            </Button>
          </div>
        ))}
        <Button onClick={handleAddPhoto}>Add Photo</Button>

        <Display
          value={formData.display}
          onChange={(val) => setFormData((prev) => ({ ...prev, display: val }))}
        />

        <Index value={formData.index} onChange={handleChange} />

        <SEOForm
          seo={formData.seo}
          onChange={(updatedSeo) =>
            setFormData({ ...formData, seo: updatedSeo })
          }
        />

        <ButtonGroup negativeClick={onClose} positiveClick={handleSubmit} />
      </form>
    </Modal>
  );
};

export default FacilityForm;
