import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  ImageUpload,
  Index,
  Display,
  ButtonGroup,
  Heading,
  DepartmentDD,
  TextEditor,
  Label,
  Select,
  SEOForm,
} from "..";
import {
  usePostSubCategoryMutation,
  useUpdateSubCategoryMutation,
} from "@/redux/api/subcategory";
import { toast } from "sonner";
import { LuTrash } from "react-icons/lu";
import { useSelector } from "react-redux";
import {
  useGetCategoryByDepartmentIdQuery,
  useGetCategoryQuery,
} from "@/redux/api/category";
import { usePostUploadFileMutation } from "@/redux/api/upload";

const SubCategoryForm = ({ onClose, equipments }) => {
  const [upload] = usePostUploadFileMutation();
  const { department, role } = useSelector((state) => state.auth);
  const { data } =
    role === "superadmin"
      ? useGetCategoryQuery()
      : useGetCategoryByDepartmentIdQuery(department);

  const initialState = {
    image: "",
    name: {
      en: "",
      ar: "",
    },
    category: "",
    description: {
      en: "",
      ar: "",
    },
    specification: [{ label: { en: "", ar: "" }, value: { en: "", ar: "" } }],
    photos: [],
    pdf: "",
    department: department || "",
    featured: false,
    popular: false,
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
  const [postEquipments] = usePostSubCategoryMutation();
  const [updateEquipments] = useUpdateSubCategoryMutation();

  useEffect(() => {
    setFormData(equipments ? equipments : initialState);
  }, [equipments]);

  const handleChange = (e, field, lang) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleSpecificationChange = (index, field, lang, value) => {
    setFormData((prev) => {
      const newSpecifications = [...prev.specification];
      newSpecifications[index] = {
        ...newSpecifications[index],
        [field]: {
          ...newSpecifications[index][field],
          [lang]: value,
        },
      };
      return { ...prev, specification: newSpecifications };
    });
  };

  const handleAddSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specification: [
        ...prev.specification,
        { label: { en: "", ar: "" }, value: { en: "", ar: "" } },
      ],
    }));
  };

  const handleRemoveSpecification = (index) => {
    const newSpecification = formData.specification.filter(
      (_, i) => i !== index,
    );
    setFormData((prev) => ({ ...prev, specification: newSpecification }));
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
      equipments
        ? await updateEquipments({ id: equipments._id, ...formData }).unwrap()
        : await postEquipments(formData).unwrap();

      toast.success(
        `Equipments ${equipments ? "updated" : "created"} successfully`,
      );
      setFormData(initialState);
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Form
      formTitle={`${equipments ? "Edit" : "New"} Equipments`}
      formDescription="Add or edit the equipment details below. Click save when done."
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
          imageUrl={formData.image}
          uploadUrl={"/uploads/equipments"}
          title={formData.name.en}
          onUploadSuccess={(filePath) =>
            setFormData({ ...formData, image: filePath })
          }
        />

        <div className="space-y-1">
          <Label>Category</Label>
          <Select
            id="category"
            value={formData.category}
            options={data?.data?.map((cat) => ({
              key: cat._id,
              value: cat._id,
              label: cat.name.en,
            }))}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value,
              })
            }
          />
        </div>

        <TextEditor
          id="description_en"
          label="Description (EN)"
          value={formData.description.en}
          onChange={(e) => handleNestedChange("description", "en", e)}
        />

        <TextEditor
          id="description_ar"
          label="Description (AR)"
          value={formData.description.ar}
          onChange={(e) => handleNestedChange("description", "ar", e)}
        />

        <Heading>Specification</Heading>
        {formData.specification.map((spec, idx) => (
          <div key={idx} className="flex space-x-4">
            <div className="w-1/2">
              <Input
                label="Label (EN)"
                value={spec.label.en}
                onChange={(e) =>
                  handleSpecificationChange(idx, "label", "en", e.target.value)
                }
              />
              <Input
                label="Value (EN)"
                value={spec.value.en}
                onChange={(e) =>
                  handleSpecificationChange(idx, "value", "en", e.target.value)
                }
              />
            </div>
            <div className="w-1/2">
              <Input
                label="Label (AR)"
                value={spec.label.ar}
                onChange={(e) =>
                  handleSpecificationChange(idx, "label", "ar", e.target.value)
                }
              />
              <Input
                label="Value (AR)"
                value={spec.value.ar}
                onChange={(e) =>
                  handleSpecificationChange(idx, "value", "ar", e.target.value)
                }
              />
            </div>
            <Button
              onClick={() => handleRemoveSpecification(idx)}
              className="flex self-end"
            >
              <LuTrash />
            </Button>
          </div>
        ))}
        <Button onClick={handleAddSpecification}>Add Specification</Button>

        <Heading>Photos</Heading>
        {formData.photos.map((photo, idx) => (
          <div key={idx} className="flex items-center w-full gap-5">
            <ImageUpload
              imageUrl={photo}
              uploadUrl={"/uploads/region"}
              className="w-full"
              onUploadSuccess={(imageUrl) => handlePhotosChange(idx, imageUrl)}
            />
            <Button onClick={() => handleRemovePhoto(idx)} className="mb-5">
              <LuTrash />
            </Button>
          </div>
        ))}

        <Button onClick={handleAddPhoto}>Add Photo</Button>

        <div className="space-y-1.5">
          <Label>Pdf</Label>

          {/* If PDF already exists, show preview */}
          {formData.pdf ? (
            <div className="flex items-center gap-3">
              <a
                href={import.meta.env.VITE_API_BASE_URL + formData.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {formData.pdf.split("/").pop()} {/* show only filename */}
              </a>
              <Button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, pdf: "" }))}
              >
                <LuTrash />
              </Button>
            </div>
          ) : (
            // Otherwise show file input
            <Input
              type="file"
              accept="application/pdf"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const formDataToUpload = new FormData();
                formDataToUpload.append("file", file);

                try {
                  const response = await upload({
                    image: formDataToUpload,
                    folder: "/uploads/pdf",
                  }).unwrap();
                  setFormData((prev) => ({ ...prev, pdf: response.filePath }));
                } catch (error) {
                  console.error("upload failed", error);
                }
              }}
            />
          )}
        </div>

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
           onChange={(val) => setFormData((prev) => ({ ...prev, featured: val }))}
        />

        <Display
          label="Show in Popular Equipments"
          value={formData.popular}
          onChange={(val) => setFormData((prev) => ({ ...prev, popular: val }))}
        />

        <Display
          value={formData.display}
           onChange={(val) => setFormData((prev) => ({ ...prev, display: val }))}
        />

        <Index
          value={formData.index}
          onChange={(value) => setFormData({ ...formData, index: value })}
        />

        <SEOForm
          seo={formData.seo}
          onChange={(updatedSeo) =>
            setFormData({ ...formData, seo: updatedSeo })
          }
        />

        <ButtonGroup negativeClick={onClose} />
      </form>
    </Form>
  );
};

export default SubCategoryForm;
