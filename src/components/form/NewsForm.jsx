import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  TextEditor,
  ImageUpload,
  Display,
  ButtonGroup,
  SEOForm,
  Text,
  Button,
} from "..";
import { usePostNewsMutation, useUpdateNewsMutation } from "@/redux/api/news";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const NewsForm = ({ onClose, news }) => {
  const { role, department } = useSelector((state) => state.auth);

  const initialState = {
    image: "",
    title: { en: "", ar: "" },
    date: "",
    location: { en: "", ar: "" },
    description: { en: "", ar: "" },
    display: true,
    showInMain: role === "superadmin",
    requested: false,
    department: role !== "superadmin" ? department : undefined,
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
  const [postNews] = usePostNewsMutation();
  const [updateNews] = useUpdateNewsMutation();

  useEffect(() => {
    if (news) {
      setFormData({
        ...news,
        department: news.department || undefined,
      });
    } else {
      setFormData(initialState);
    }
  }, [news]);

  // ---------- handlers ----------

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNestedChange = (e, field) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [id]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...formData };

    // 🚫 remove invalid ObjectId
    if (!payload.department) {
      delete payload.department;
    }

    // 🔐 enforce department for non-superadmin
    if (role !== "superadmin") {
      payload.department = department;
    }

    try {
      if (news) {
        await updateNews({
          id: news._id,
          ...payload,
        }).unwrap();
      } else {
        await postNews(payload).unwrap();
      }

      toast.success(`News ${news ? "updated" : "created"} successfully`);
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleRequest = async () => {
    try {
      await updateNews({
        id: news._id,
        requested: true,
        department,
      }).unwrap();

      setFormData((prev) => ({ ...prev, requested: true }));
      toast.success("Request sent to admin");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  // ---------- UI ----------

  return (
    <Form
      formTitle={`${news ? "Edit" : "New"} News`}
      formDescription="Make changes to the news here. Click save when you're done."
      onClose={onClose}
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        {/* Title */}
        <Input
          id="en"
          label="Title (EN)"
          value={formData.title.en}
          onChange={(e) => handleNestedChange(e, "title")}
        />

        <Input
          id="ar"
          label="Title (AR)"
          value={formData.title.ar}
          onChange={(e) => handleNestedChange(e, "title")}
        />

        {/* Image */}
        <ImageUpload
          imageUrl={formData.image}
          uploadUrl="/uploads/news"
          title={formData.title.en}
          onUploadSuccess={(filePath) =>
            setFormData((prev) => ({ ...prev, image: filePath }))
          }
        />

        {/* Date */}
        <Input
          id="date"
          label="Date"
          type="date"
          value={formData.date}
          onChange={handleChange}
        />

        {/* Location */}
        <Input
          id="en"
          label="Location (EN)"
          value={formData.location.en}
          onChange={(e) => handleNestedChange(e, "location")}
        />

        <Input
          id="ar"
          label="Location (AR)"
          value={formData.location.ar}
          onChange={(e) => handleNestedChange(e, "location")}
        />

        {/* Description */}
        <TextEditor
          label="Description (EN)"
          value={formData.description.en}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              description: { ...prev.description, en: value },
            }))
          }
        />

        <TextEditor
          label="Description (AR)"
          value={formData.description.ar}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              description: { ...prev.description, ar: value },
            }))
          }
        />

        {/* Display */}
        <Display
          value={formData.display}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, display: val }))
          }
        />

        {/* Show in Main (superadmin only) */}
        {role === "superadmin" && (
          <Display
            label="Show in Main"
            value={formData.showInMain}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, showInMain: val }))
            }
          />
        )}

        {/* SEO */}
        <SEOForm
          seo={formData.seo}
          onChange={(updatedSeo) =>
            setFormData((prev) => ({ ...prev, seo: updatedSeo }))
          }
        />

        {/* Request to feature */}
        {role !== "superadmin" &&
          (formData.showInMain ? (
            <Text className="text-center">
              Already featured on Main Website
            </Text>
          ) : formData.requested ? (
            <Text className="text-center">
              Request already sent to feature on Main Website
            </Text>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleRequest}
              type="button"
            >
              Request to feature on Main Website
            </Button>
          ))}

        <ButtonGroup negativeClick={onClose} />
      </form>
    </Form>
  );
};

export default NewsForm;
