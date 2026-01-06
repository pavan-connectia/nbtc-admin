import React, { useEffect, useMemo, useState } from "react";
import {
  Form,
  Input,
  ImageUpload,
  Index,
  Display,
  ButtonGroup,
  Select,
  Label,
  SEOForm,
  DepartmentDD,
  Button,
  Text,
} from "..";
import {
  usePostAwardsMutation,
  useUpdateAwardsMutation,
} from "@/redux/api/awards";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import MultiDepartmentDD from "@/components/shared/MultiDepartment";

const AwardsForm = ({ onClose, awards }) => {
  const { department, role } = useSelector((state) => state.auth);

  console.log(role)

  const initialState = useMemo(
    () => ({
      image: "",
      name: { en: "", ar: "" },
      showInMain: false,
      requested: false,
      display: true,
      type: "quality",
      department: department ? [department] : [],
      index: 0,
      seo: {
        title: "",
        metaDescription: "",
        metaKeywords: "",
        ogImage: "",
        ogUrl: "",
        canonicalUrl: "",
      },
    }),
    [department],
  );

  const [formData, setFormData] = useState(initialState);

  const [postAwards] = usePostAwardsMutation();
  const [updateAwards] = useUpdateAwardsMutation();

  useEffect(() => {
    if (awards) {
      setFormData({
        ...awards,
        department: Array.isArray(awards.department)
          ? awards.department
          : awards.department
          ? [awards.department]
          : [],
      });
    } else {
      setFormData(initialState);
    }
  }, [awards, initialState]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    let newValue = value;

    if (id === "display" || id === "showInMain") {
      newValue = value === "true";
    }

    setFormData((prev) => ({ ...prev, [id]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (awards) {
        await updateAwards({
          id: awards._id,
          ...formData,
        }).unwrap();
      } else {
        await postAwards(formData).unwrap();
      }

      toast.success(
        `Awards ${awards ? "updated" : "created"} successfully`,
      );
      setFormData(initialState);
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleRequest = async () => {
    try {
      await updateAwards({
        id: awards._id,
        department: formData.department,
        requested: true,
      }).unwrap();

      setFormData((prev) => ({ ...prev, requested: true }));
      toast.success("Request sent to admin");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <Form
      formTitle={`${awards ? "Edit" : "New"} Awards`}
      formDescription="Make changes to the awards here. Click save when you're done."
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <Input
          id="name-en"
          label="Name (EN)"
          value={formData.name.en}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              name: { ...prev.name, en: e.target.value },
            }))
          }
        />

        <Input
          id="name-ar"
          label="Name (AR)"
          value={formData.name.ar}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              name: { ...prev.name, ar: e.target.value },
            }))
          }
        />

        <ImageUpload
          imageUrl={formData.image}
          title={formData.name.en}
          uploadUrl="/uploads/awards"
          onUploadSuccess={(filePath) =>
            setFormData((prev) => ({ ...prev, image: filePath }))
          }
        />

        <div className="space-y-1">
          <Label id="type">Type</Label>
          <Select
            id="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Select the type"
            options={[
              { key: "quality", value: "quality", label: "Quality" },
              { key: "hse", value: "hse", label: "HSE" },
              {
                key: "recognition",
                value: "recognition",
                label: "Recognition",
              },
              {
                key: "accredetions",
                value: "accredetions",
                label: "Accreditations",
              },
            ]}
          />
        </div>

        {role === "superadmin" ? (
          <MultiDepartmentDD
            multiple
            value={formData.department}
            onChange={(values) =>
              setFormData((prev) => ({
                ...prev,
                department: values,
              }))
            }
          />
        ) : (
          <DepartmentDD value={formData.department[0] || ""} disabled />
        )}

        <Display
          value={formData.display}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, display: val }))
          }
        />

        {role === "superadmin" && (
          <Display
            id="showInMain"
            label="Show in Main"
            value={formData.showInMain}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, showInMain: val }))
            }
          />
        )}

        <Index value={formData.index} onChange={handleChange} />

        <SEOForm
          seo={formData.seo}
          onChange={(updatedSeo) =>
            setFormData((prev) => ({ ...prev, seo: updatedSeo }))
          }
        />

        {role !== "superadmin" &&
          (formData.showInMain ? (
            <Text className="text-center">
              Already featured on Main Website
            </Text>
          ) : formData.requested ? (
            <Text className="text-center">
              Request already sent to be featured on Main Website
            </Text>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleRequest}
            >
              Request to be featured on Main Website
            </Button>
          ))}

        <ButtonGroup negativeClick={onClose} />
      </form>
    </Form>
  );
};

export default AwardsForm;
