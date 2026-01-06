import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  ImageUpload,
  TextArea,
  Index,
  Display,
  ButtonGroup,
  DepartmentDD,
} from "..";
import {
  usePostBrandsMutation,
  useUpdateBrandsMutation,
} from "@/redux/api/brands";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const BrandsForm = ({ onClose, brands }) => {
  const { department } = useSelector((state) => state.auth);
  const initialState = {
    image: "",
    name: { en: "", ar: "" },
    description: { en: "", ar: "" },
    department: department || "",
    display: true,
    index: 0,
  };
  const [formData, setFormData] = useState(initialState);

  const [postBrands] = usePostBrandsMutation();
  const [updateBrands] = useUpdateBrandsMutation();

  useEffect(() => {
    setFormData(brands ? brands : initialState);
  }, [brands]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleNestedChange = (e, field) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [field]: { ...formData[field], [id]: value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      brands
        ? await updateBrands({ id: brands._id, ...formData }).unwrap()
        : await postBrands(formData).unwrap();

      toast.success(`Brands ${brands ? "updated" : "created"}  successfully`);
      setFormData(initialState);

      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Form
      formTitle={`${brands ? "Edit" : "New"} Brands`}
      formDescription="Make changes to the brands here. Click save when you're done."
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <Input
          id="en"
          label="Name (EN)"
          value={formData.name.en}
          onChange={(e) => handleNestedChange(e, "name")}
        />

        <Input
          id="ar"
          label="Name (AR)"
          value={formData.name.ar}
          onChange={(e) => handleNestedChange(e, "name")}
        />

        <ImageUpload
          imageUrl={formData?.image}
          title={formData.name.en}
          uploadUrl={"/uploads/brands"}
          onUploadSuccess={(filePath) =>
            setFormData({ ...formData, image: filePath })
          }
        />

        <TextArea
          id="en"
          label="Description (EN)"
          value={formData?.description?.en}
          rows={7}
          onChange={(e) => handleNestedChange(e, "description")}
        />

        <TextArea
          id="ar"
          label="Description (AR)"
          value={formData?.description?.ar}
          rows={7}
          onChange={(e) => handleNestedChange(e, "description")}
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
          value={formData.display}
          onChange={(val) => setFormData((prev) => ({ ...prev, display: val }))}
        />

        <Index value={formData.index} onChange={handleChange} />

        <ButtonGroup negativeClick={onClose} />
      </form>
    </Form>
  );
};

export default BrandsForm;
