import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  ButtonGroup,
  DepartmentDD,
  ImageUpload,
  Display,
  TextEditor,
} from "..";
import {
  usePostCategoryMutation,
  useUpdateCategoryMutation,
} from "@/redux/api/category";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { LuTrash } from "react-icons/lu";

const CategoryForm = ({ isOpen, onClose, category }) => {
  const { department } = useSelector((state) => state.auth);
  const initialState = {
    image: "",
    name: {
      en: "",
      ar: "",
    },
    description: {
      en: "",
      ar: "",
    },
    featured: false,
    popular: false,
    department: department || "",
  };

  const [formData, setFormData] = useState(initialState);
  const [postCategory] = usePostCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  useEffect(() => {
    setFormData(category ? category : initialState);
  }, [category]);

  const handleChange = (e, field, lang) => {
    const { value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
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
      category
        ? await updateCategory({
            id: category._id,
            ...formData,
          }).unwrap()
        : await postCategory(formData).unwrap();

      toast.success(
        `Category ${category ? "updated" : "created"}  successfully`,
      );

      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      modalTitle={`${category ? "Edit" : "New"} Category`}
      modalDescription="Add or edit the equipment details below. Click save when done."
      onClose={onClose}
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <Input
          id="name_en"
          label="Name (EN)"
          value={formData.name.en}
          onChange={(e) => handleChange(e, "name", "en")}
        />

        <Input
          id="name_ar"
          label="Name (AR)"
          value={formData.name.ar}
          onChange={(e) => handleChange(e, "name", "ar")}
        />

        <ImageUpload
          uploadUrl={"/uploads/equipment"}
          imageUrl={formData?.image}
          title={formData.name.en}
          onUploadSuccess={(filePath) =>
            setFormData({ ...formData, image: filePath })
          }
          className="h-[250px] w-full object-contain"
        />

        <TextEditor
          id="description"
          label="Description (EN)"
          value={formData?.description?.en}
          onChange={(e) => handleNestedChange("description", "en", e)}
        />

        <TextEditor
          id="description_ar"
          label="Description (AR)"
          value={formData?.description?.ar}
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

        <Display
          label="Show in Featured Equipments"
          value={formData.featured}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, featured: val }))
          }
        />

        <Display
          label="Show in Popular Equipments"
          value={formData.popular}
          onChange={(val) => setFormData((prev) => ({ ...prev, popular: val }))}
        />

        <ButtonGroup negativeClick={onClose} />
      </form>
    </Modal>
  );
};

export default CategoryForm;
