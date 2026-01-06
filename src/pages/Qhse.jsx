import React, { useState, useEffect } from "react";
import { useGetQhseQuery, useUpdateQhseMutation } from "../redux/api/qhse";
import {
  Heading,
  Button,
  Card,
  TextEditor,
  ImageUpload,
  Text,
} from "../components";
import { toast } from "sonner";

const initialFormState = {
  quality: {
    image: "",
    description: {
      en: "",
      ar: "",
    },
  },
};

const Qhse = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [id, setId] = useState(null);

  const { data, isSuccess } = useGetQhseQuery();
  const [updateQhse] = useUpdateQhseMutation();

  useEffect(() => {
    if (isSuccess && data?.data) {
      const qhseData = data?.data;
      if (qhseData?._id) setId(qhseData._id);
      setFormData({
        ...initialFormState,
        ...qhseData,
      });
    }
  }, [isSuccess, data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      console.error("ID is missing");
      return;
    }
    try {
      await updateQhse({ id, ...formData }).unwrap();
      toast.success("Qhse updated successfully");
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleInputChange = (section, field, lang, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: {
          ...prevData[section][field],
          [lang]: value,
        },
      },
    }));
  };

  return (
    <>
      <Card
        as="form"
        onSubmit={handleSubmit}
        className="space-y-3 rounded-lg p-5"
      >
        <Heading>Qhse Page</Heading>
        <Text>
          Make changes to the QHSE page here. Click save when you're done.
        </Text>

        <div className="space-y-3">
          <Heading>QHSE</Heading>

          <ImageUpload
            id="quality-image"
            label="Quality Image"
            value={formData.quality.image}
            uploadUrl="/uploads/qhse"
            imageUrl={formData.quality.image}
            className="h-[15rem] object-contain"
            onUploadSuccess={(filePath) =>
              setFormData({
                ...formData,
                quality: { ...formData.quality, image: filePath },
              })
            }
          />

          {/* Quality Description in English */}
          <TextEditor
            id="quality-description-en"
            label="Quality Description (English)"
            value={formData.quality.description.en}
            onChange={(value) =>
              handleInputChange("quality", "description", "en", value)
            }
          />

          {/* Quality Description in Arabic */}
          <TextEditor
            id="quality-description-ar"
            label="Quality Description (Arabic)"
            value={formData.quality.description.ar}
            onChange={(value) =>
              handleInputChange("quality", "description", "ar", value)
            }
          />
        </div>

        <Button type="submit" className="w-full">
          Save
        </Button>
      </Card>
    </>
  );
};

export default Qhse;
