import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  ImageUpload,
  ButtonGroup,
  Display,
  SEOForm,
  TextArea,
  TextEditor,
  Index,
  Label,
  Select,
} from "..";
import {
  usePostCoreBusinessMutation,
  useUpdateCoreBusinessMutation,
} from "@/redux/api/coreBusiness";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const CoreBusinessForm = ({ onClose, coreBusiness }) => {
  const { department } = useSelector((state) => state.auth);
  const [postCoreBusiness] = usePostCoreBusinessMutation();
  const [updateCoreBusiness] = useUpdateCoreBusinessMutation();
  const initialState = {
    name: { en: "", ar: "" },
    learnMore: "",
    description: { en: "", ar: "" },
    mainDescription: { en: "", ar: "" },
    banner: "",
    featuredEquipments: [],
    popularEquipments: [],
    hasSubDomain: false,
    displayProjects: true,
    displayCoreBusiness: true,
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

  useEffect(() => {
    setFormData(coreBusiness ? coreBusiness : initialState);
  }, [coreBusiness]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      coreBusiness
        ? await updateCoreBusiness({
            id: coreBusiness._id,
            department: department,
            ...formData,
          }).unwrap()
        : await postCoreBusiness(formData).unwrap();

      toast.success(
        `Core business ${coreBusiness ? "updated" : "created"}  successfully`,
      );
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <Form
      formTitle={`${coreBusiness ? "Edit" : "New"} Core Business`}
      formDescription="Make changes to the core business here. Click save when you're done."
    >
      <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
        <Input
          id="name"
          label="Title (EN)"
          value={formData.name.en}
          onChange={(e) => handleNestedChange("name", "en", e.target.value)}
        />

        <Input
          id="name"
          label="Title (AR)"
          value={formData.name.ar}
          onChange={(e) => handleNestedChange("name", "ar", e.target.value)}
        />

        <ImageUpload
          imageUrl={formData.banner}
          uploadUrl="/uploads/coreBusiness"
          title={formData.name.en}
          onUploadSuccess={(filePath) => handleFieldChange("banner", filePath)}
        />

        <Input
          id="learnMore"
          label="Learn More"
          value={formData.learnMore}
          onChange={(e) => handleFieldChange("learnMore", e.target.value)}
        />

        <TextArea
          id="description"
          label="Description (EN)"
          value={formData.description.en}
          onChange={(e) =>
            handleNestedChange("description", "en", e.target.value)
          }
        />

        <TextArea
          id="description"
          label="Description (AR)"
          value={formData.description.ar}
          onChange={(e) =>
            handleNestedChange("description", "ar", e.target.value)
          }
        />

        <TextEditor
          id="mainDescription"
          label="Main Description (EN)"
          value={formData?.mainDescription?.en}
          onChange={(e) => handleNestedChange("mainDescription", "en", e)}
        />

        <TextEditor
          id="mainDescription"
          label="Main Description (AR)"
          value={formData?.mainDescription?.ar}
          onChange={(e) => handleNestedChange("mainDescription", "ar", e)}
        />

        <Display
          label="Display Core Projects"
          value={formData.displayProjects}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, displayProjects: val }))
          }
        />
        <Display
          label="Display Core Business"
          value={formData.displayCoreBusiness}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, displayCoreBusiness: val }))
          }
        />

        <div className="space-y-1">
          <Label id="hasSubDomain">Has a Sub Domain?</Label>
          <Select
            id="hasSubDomain"
            value={formData?.hasSubDomain}
            onChange={(e) => handleFieldChange("hasSubDomain", e.target.value)}
            options={[
              { key: false, value: false, label: "No" },
              { key: true, value: true, label: "Yes" },
            ]}
          />
        </div>

        <Index
          value={formData.index}
          onChange={(e) => handleFieldChange("index", e.target.value)}
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

export default CoreBusinessForm;
