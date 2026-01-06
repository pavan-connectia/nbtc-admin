import React, { useState, useEffect } from "react";
import { Button, Card, Heading, Text, TextEditor, SEOForm } from "@/components";
import {
  useGetQualificationQuery,
  useUpdateQualificationMutation,
} from "@/redux/api/qualification";
import { toast } from "sonner";

const Qualification = () => {
  const { data, isSuccess } = useGetQualificationQuery();
  const [id, setId] = useState("");
  const [updateQualification] = useUpdateQualificationMutation();

  const initialFormState = {
    description: { en: "", ar: "" },
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isSuccess && data?.data) {
      const qualificationData = data.data;
      if (qualificationData?._id) setId(qualificationData._id);
      setFormData({
        ...initialFormState,
        ...qualificationData,
      });
    }
  }, [isSuccess, data]);

  const handleNestedChange = (parentKey, key) => (content) => {
    setFormData((prevData) => ({
      ...prevData,
      [parentKey]: {
        ...prevData[parentKey],
        [key]: content,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      console.error("ID is missing");
      return;
    }
    try {
      await updateQualification({ id, ...formData }).unwrap();
      toast.success("Qualification data updated successfully");
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <>
      <Card
        className="space-y-3 rounded-lg p-5"
        as="form"
        onSubmit={handleSubmit}
      >
        <Heading>Qualification Page</Heading>
        <Text>
          Make changes to the qualification page here. Click save when you're
          done.
        </Text>

        <TextEditor
          label="Description (EN)"
          value={formData.description.en}
          onChange={handleNestedChange("description", "en")}
        />

        <TextEditor
          label="Description (AR)"
          value={formData.description.ar}
          onChange={handleNestedChange("description", "ar")}
        />

        <SEOForm
          seo={formData.seo}
          onChange={(updatedSeo) =>
            setFormData({ ...formData, seo: updatedSeo })
          }
        />

        <Button type="submit" className="!my-10 w-full">
          Save Changes
        </Button>
      </Card>
    </>
  );
};

export default Qualification;
