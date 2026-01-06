import React, { useState, useEffect } from "react";
import {
  Input,
  ImageUpload,
  TextArea,
  Display,
  ButtonGroup,
  Index,
  Button,
  TextEditor,
  Form,
} from "..";
import {
  usePostBranchesMutation,
  useUpdateBranchesMutation,
} from "@/redux/api/branches";
import { toast } from "sonner";
import { LuTrash } from "react-icons/lu";

const BranchesForm = ({ onClose, branches }) => {
  const initialState = {
    name: {
      en: "",
      ar: "",
    },
    image: "",
    facilities: { en: "", ar: "" },
    description: {
      en: "",
      ar: "",
    },
    feautedProjects: [
      {
        image: "",
        description: {
          en: "",
          ar: "",
        },
        title: {
          en: "",
          ar: "",
        },
        location: {
          en: "",
          ar: "",
        },
      },
    ],
    display: false,
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
  const [postBranches] = usePostBranchesMutation();
  const [updateBranches] = useUpdateBranchesMutation();

  useEffect(() => {
    setFormData(branches ? branches : initialState);
  }, [branches]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const newValue = id === "display" ? value === "true" : value;
    setFormData((prev) => ({ ...prev, [id]: newValue }));
  };

  const handleNestedChange = (field, subField, lang, value, index = null) => {
    setFormData((prev) => {
      if (field === "feautedProjects") {
        const updatedProjects = prev.feautedProjects.map((project, idx) =>
          idx === index
            ? {
                ...project,
                [subField]: { ...project[subField], [lang]: value },
              }
            : project,
        );
        return { ...prev, feautedProjects: updatedProjects };
      } else {
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [subField]: { ...prev[field][subField], [lang]: value },
          },
        };
      }
    });
  };

  const handleAddProject = () => {
    setFormData((prev) => ({
      ...prev,
      feautedProjects: [
        ...prev.feautedProjects,
        { image: "", title: { en: "", ar: "" }, location: { en: "", ar: "" } },
      ],
    }));
  };

  const handleRemoveProject = (index) => {
    setFormData((prev) => {
      const updatedProjects = [...prev.feautedProjects];
      updatedProjects.splice(index, 1);
      return { ...prev, feautedProjects: updatedProjects };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      branches
        ? await updateBranches({ id: branches._id, ...formData }).unwrap()
        : await postBranches(formData).unwrap();

      toast.success(`Branches ${branches ? "updated" : "saved"} successfully`);
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <Form
      formTitle={`${branches ? "Edit" : "New"} Branches`}
      formDescription="Make changes to the branches here. Click save when you're done."
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <Input
          id="name"
          label="Name (EN)"
          value={formData.name?.en || ""}
          onChange={(e) => handleNestedChange("name", "en", e.target.value)}
        />

        <Input
          id="name"
          label="Name (AR)"
          value={formData.name?.ar || ""}
          onChange={(e) => handleNestedChange("name", "ar", e.target.value)}
        />

        <ImageUpload
          uploadUrl={"/uploads/branches"}
          title={formData.name.en}
          imageUrl={formData.image}
          onUploadSuccess={(filePath) =>
            setFormData({ ...formData, image: filePath })
          }
        />

        <TextEditor
          id="description-en"
          label="Description (EN)"
          value={formData.description.en || ""}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              description: { ...prev.description, en: value },
            }))
          }
        />

        <TextEditor
          id="description-ar"
          label="Description (AR)"
          value={formData.description.ar || ""}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              description: { ...prev.description, ar: value },
            }))
          }
        />

        <TextEditor
          id="facilities"
          label="Facilities (EN)"
          value={formData.facilities?.en || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              facilities: { ...formData.facilities, en: e },
            })
          }
        />

        <TextEditor
          id="facilities"
          label="Facilities (AR)"
          value={formData.facilities?.ar || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              facilities: { ...formData.facilities, ar: e },
            })
          }
        />

        {formData.feautedProjects.map((project, index) => (
          <div key={index} className="space-y-2">
            <Input
              label={`Project Title (EN) ${index + 1}`}
              value={project.title?.en || ""}
              onChange={(e) =>
                handleNestedChange(
                  "feautedProjects",
                  "title",
                  "en",
                  e.target.value,
                  index,
                )
              }
            />

            <Input
              label={`Project Title (AR) ${index + 1}`}
              value={project.title?.ar || ""}
              onChange={(e) =>
                handleNestedChange(
                  "feautedProjects",
                  "title",
                  "ar",
                  e.target.value,
                  index,
                )
              }
            />

            <Input
              label={`Location (EN) ${index + 1}`}
              value={project.location?.en || ""}
              onChange={(e) =>
                handleNestedChange(
                  "feautedProjects",
                  "location",
                  "en",
                  e.target.value,
                  index,
                )
              }
            />

            <Input
              label={`Location (AR) ${index + 1}`}
              value={project.location?.ar || ""}
              onChange={(e) =>
                handleNestedChange(
                  "feautedProjects",
                  "location",
                  "ar",
                  e.target.value,
                  index,
                )
              }
            />

            <TextArea
              label={`Description (EN) ${index + 1}`}
              value={project.description?.en || ""}
              onChange={(e) =>
                handleNestedChange(
                  "feautedProjects",
                  "description",
                  "en",
                  e.target.value,
                  index,
                )
              }
            />

            <TextArea
              label={`Description (AR) ${index + 1}`}
              value={project.description?.ar || ""}
              onChange={(e) =>
                handleNestedChange(
                  "feautedProjects",
                  "description",
                  "ar",
                  e.target.value,
                  index,
                )
              }
            />

            <ImageUpload
              uploadUrl={"/uploads/projects"}
              title={project.title.en}
              imageUrl={project.image}
              onUploadSuccess={(filePath) => {
                const updatedProjects = [...formData.feautedProjects];
                updatedProjects[index].image = filePath;
                setFormData({ ...formData, feautedProjects: updatedProjects });
              }}
            />

            <Button onClick={() => handleRemoveProject(index)}>
              <LuTrash />
            </Button>
          </div>
        ))}

        <Button onClick={handleAddProject}>Add Project</Button>

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

export default BranchesForm;
