import React, { useState, useEffect } from "react";
import {
  Modal,
  Label,
  Input,
  Select,
  ImageUpload,
  Display,
  ButtonGroup,
  Index,
  DepartmentDD,
  TextEditor,
  SEOForm,
} from "..";
import {
  usePostProjectsMutation,
  useUpdateProjectsMutation,
} from "@/redux/api/projects";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const ProjectsForm = ({ isOpen, onClose, projects }) => {
  const { department } = useSelector((state) => state.auth);
  const initialState = {
    image: "",
    title: { en: "", ar: "" },
    location: { en: "", ar: "" },
    description: { en: "", ar: "" },
    region: "",
    type: "",
    department: department || "",
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

  const [postProjects] = usePostProjectsMutation();
  const [updateProjects] = useUpdateProjectsMutation();

  useEffect(() => {
    setFormData(projects ? projects : initialState);
  }, [projects]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };

    if (department) {
      payload.department = department;
    }
    try {
      projects
        ? await updateProjects({ id: projects._id, ...payload }).unwrap()
        : await postProjects(payload).unwrap();

      toast.success(`Projects ${projects ? "updated" : "saved"}  successfully`);
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      modalTitle={`${projects ? "Edit" : "New"} Projects`}
      modalDescription="Make changes to the projects here. Click save when you're done."
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
          uploadUrl={"/uploads/projects"}
          title={formData.title.en}
          imageUrl={formData.image}
          onUploadSuccess={(filePath) =>
            setFormData({ ...formData, image: filePath })
          }
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

        <div className="space-y-1">
          <Label id={"region"}>Region</Label>
          <Select
            id={"region"}
            value={formData.region}
            onChange={handleChange}
            options={[
              { key: "kuwait", value: "kuwait", label: "Kuwait" },
              { key: "ksa", value: "ksa", label: "KSA" },
              { key: "auh", value: "auh", label: "AUH" },
            ]}
          />
        </div>

        <div className="space-y-1">
          <Label id={"type"}>Type</Label>
          <Select
            id={"type"}
            value={formData.type}
            onChange={handleChange}
            options={[
              { key: "featured", value: "featured", label: "Featured project" },
              { key: "ongoing", value: "ongoing", label: "Ongoing project" },
            ]}
          />
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

export default ProjectsForm;
