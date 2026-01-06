import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Heading,
  ImageUpload,
  Input,
  Text,
  TextArea,
  TextEditor,
  SEOForm,
  Label,
  Select,
} from "@/components";
import { useGetHomeQuery, useUpdateHomeMutation } from "@/redux/api/home";
import { LuTrash } from "react-icons/lu";
import { toast } from "sonner";
import { usePostUploadMutation } from "@/redux/api/upload";

const Home = () => {
  const { data, isSuccess, isLoading } = useGetHomeQuery();
  const [id, setId] = useState("");
  const [updateHome] = useUpdateHomeMutation();
  const [upload] = usePostUploadMutation();

  const initialFormState = {
    heroType: "video",
    banner: "",
    video: "",
    heading: { en: "", ar: "" },
    description: { en: "", ar: "" },
    learnMore: "",
    slider: [],
    statistics: [],
    journey: { en: "", ar: "" },
    mission: { en: "", ar: "" },
    value: { en: "", ar: "" },
    vision: { en: "", ar: "" },
    facebookLink: "",
    youtubeLink: "",
    twitterLink: "",
    instagramLink: "",
    linkedInLink: "",
    companyAddress: [],
    companyPhones: [],
    companyEmail: [],
    seo: {
      title: "",
      metaDescription: "",
      metaKeywords: "",
      ogImage: "",
      ogUrl: "",
      canonicalUrl: "",
    },
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isSuccess && data?.data) {
      const homeData = data.data;
      if (homeData?._id) setId(homeData._id);

      setFormData((prev) => ({
        ...prev,
        ...homeData,
      }));
    }
  }, [isSuccess, data]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNestedChange = (parentKey, lang) => (content) => {
    const value = content?.target ? content.target.value : content; 
    setFormData((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [lang]: value,
      },
    }));
  };

  const handleArrayChange = (index, arrayField, key, subKey = null) => (e) => {
    const value = e?.target ? e.target.value : e;
    setFormData((prev) => {
      const updatedArray = [...prev[arrayField]];
      if (subKey) {
        updatedArray[index] = {
          ...updatedArray[index],
          [subKey]: { ...updatedArray[index][subKey], [key]: value },
        };
      } else {
        updatedArray[index] = { ...updatedArray[index], [key]: value };
      }
      return { ...prev, [arrayField]: updatedArray };
    });
  };

  const addField = (field, newEntry) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], newEntry],
    }));
  };

  const removeField = (index, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("folder", "/uploads/videos");

    try {
      const response = await upload(uploadData).unwrap();
      setFormData((prev) => ({ ...prev, video: response.filePath }));
      toast.success("Video uploaded");
    } catch (error) {
      console.error("Video upload failed", error);
      toast.error("Video upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return toast.error("ID is missing");
    try {
      await updateHome({ id, ...formData }).unwrap();
      toast.success("Home data updated successfully");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Card as="form" onSubmit={handleSubmit} className="p-5 space-y-6 rounded-lg">
      <div>
        <Heading>Home Page</Heading>
        <Text>Update your website's landing page content.</Text>
      </div>

      <div className="space-y-1">
        <Label id={"heroType"}>Hero Type</Label>
        <Select
          id={"heroType"}
          value={formData.heroType}
          onChange={(e) =>
            setFormData({ ...formData, heroType: e.target.value })
          }
          options={[
            { key: "video", value: "video", label: "Video" },
            { key: "image", value: "image", label: "Image" },
            { key: "slider", value: "slider", label: "Slider" },
          ]}
        />
      </div>

      {formData.heroType === "slider" ? (
        <div className="space-y-8">
          {formData.slider?.map((slide, index) => (
            <div key={index} className="p-4 border rounded-md space-y-3 bg-white">
              <div className="flex justify-between items-center">
                <Heading className="text-sm">Slide #{index + 1}</Heading>
                <Button variant="danger" onClick={() => removeField(index, "slider")}>
                  <LuTrash />
                </Button>
              </div>
              <ImageUpload
                label="Slide Image"
                uploadUrl="/uploads/banner"
                value={slide.image}
                onUploadSuccess={(path) => handleArrayChange(index, "slider", "image")(path)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextEditor label="Heading (EN)" value={slide.heading.en} onChange={handleArrayChange(index, "slider", "en", "heading")} />
                <TextEditor label="Heading (AR)" value={slide.heading.ar} onChange={handleArrayChange(index, "slider", "ar", "heading")} />
              </div>
              <Input
                label="Learn More Link"
                value={slide.learnMore}
                onChange={handleArrayChange(index, "slider", "learnMore")}
              />
            </div>
          ))}
          <Button type="button" onClick={() => addField("slider", { image: "", heading: { en: "", ar: "" }, description: { en: "", ar: "" }, learnMore: "" })}>
            Add New Slide
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {formData.heroType === "image" ? (
            <ImageUpload
              label="Hero Banner"
              value={formData.banner}
              onUploadSuccess={(path) => setFormData({ ...formData, banner: path })}
            />
          ) : (
            <div className="space-y-2">
              <Label>Hero Video</Label>
              {formData.video && (
                <video src={`${import.meta.env.VITE_API_BASE_URL}${formData.video}`} controls className="w-full max-h-40 rounded" />
              )}
              <Input type="file" accept="video/*" onChange={handleVideoUpload} />
            </div>
          )}
          <TextEditor
            label="Heading (EN)"
            value={formData.heading.en}
            onChange={handleNestedChange("heading", "en")}
          />
          <TextEditor
            label="Heading (AR)"
            value={formData.heading.ar}
            onChange={handleNestedChange("heading", "ar")}
          />
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

          <Input
            id="learnMore"
            label="Learn More"
            value={formData.learnMore}
            onChange={handleChange}
          />
        </div>
      )}
      <Heading>Statistics</Heading>
      {formData.statistics.map((stat, index) => (
        <div key={index} className="flex gap-3">
          <Input
            label="Number"
            value={stat.number}
            onChange={handleArrayChange(index, "statistics", "number")}
          />
          <Input
            label="Text (EN)"
            value={stat.text.en}
            onChange={handleArrayChange(index, "statistics", "en", "text")}
          />
          <Input
            label="Text (AR)"
            value={stat.text.ar}
            onChange={handleArrayChange(index, "statistics", "ar", "text")}
          />
          <Button onClick={() => removeField(index, "statistics")}>
            <LuTrash />
          </Button>
        </div>
      ))}
      <Button
        onClick={() =>
          addField("statistics", { number: "", text: { en: "", ar: "" } })
        }
      >
        Add Statistic
      </Button>

      <Heading className="pt-10">Introduction</Heading>
      <TextArea
        rows={3}
        label="Journey (EN)"
        value={formData.journey.en}
        onChange={(e) =>
          setFormData({
            ...formData,
            journey: { ...formData.journey, en: e.target.value },
          })
        }
      />
      <TextArea
        rows={3}
        label="Journey (AR)"
        value={formData.journey.ar}
        onChange={(e) =>
          setFormData({
            ...formData,
            journey: { ...formData.journey, ar: e.target.value },
          })
        }
      />

      <TextArea
        rows={3}
        label="Mission (EN)"
        value={formData.mission.en}
        onChange={(e) =>
          setFormData({
            ...formData,
            mission: { ...formData.mission, en: e.target.value },
          })
        }
      />
      <TextArea
        rows={3}
        label="Mission (AR)"
        value={formData.mission.ar}
        onChange={(e) =>
          setFormData({
            ...formData,
            mission: { ...formData.mission, ar: e.target.value },
          })
        }
      />

      <TextEditor
        label="Value (EN)"
        value={formData.value.en}
        onChange={(content) =>
          setFormData({
            ...formData,
            value: { ...formData.value, en: content },
          })
        }
      />
      <TextEditor
        label="Value (AR)"
        value={formData.value.ar}
        onChange={(content) =>
          setFormData({
            ...formData,
            value: { ...formData.value, ar: content },
          })
        }
      />

      <TextArea
        rows={3}
        label="Vision (EN)"
        value={formData.vision.en}
        onChange={(e) =>
          setFormData({
            ...formData,
            vision: { ...formData.vision, en: e.target.value },
          })
        }
      />
      <TextArea
        rows={3}
        label="Vision (AR)"
        value={formData.vision.ar}
        onChange={(e) =>
          setFormData({
            ...formData,
            vision: { ...formData.vision, ar: e.target.value },
          })
        }
      />


      <Heading className="pt-10">Social Links</Heading>
      <Input
        id="facebookLink"
        label="Facebook Link"
        value={formData.facebookLink}
        onChange={handleChange}
      />
      <Input
        id="youtubeLink"
        label="YouTube Link"
        value={formData.youtubeLink}
        onChange={handleChange}
      />
      <Input
        id="twitterLink"
        label="Twitter Link"
        value={formData.twitterLink}
        onChange={handleChange}
      />
      <Input
        id="instagramLink"
        label="Instagram Link"
        value={formData.instagramLink}
        onChange={handleChange}
      />
      <Input
        id="linkedInLink"
        label="LinkedIn Link"
        value={formData.linkedInLink}
        onChange={handleChange}
      />

      <Heading className="pt-10">Company Information</Heading>

      <Heading>Company Address</Heading>
      {formData?.companyAddress?.map((address, index) => (
        <div key={index} className="flex flex-col items-end gap-2 sm:flex-row">
          <Input
            label={`Title (EN) ${index + 1}`}
            value={address.title.en}
            onChange={handleArrayChange(index, "companyAddress", "en", "title")}
          />
          <Input
            label={`Title (AR) ${index + 1}`}
            value={address.title.ar}
            onChange={handleArrayChange(index, "companyAddress", "ar", "title")}
          />
          <Input
            label="Href"
            value={address.href}
            onChange={handleArrayChange(index, "companyAddress", "href")}
          />
          <Button
            type="button"
            onClick={() => removeField(index, "companyAddress")}
          >
            <LuTrash />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() =>
          addField("companyAddress", { title: { en: "", ar: "" }, href: "" })
        }
      >
        Add Address
      </Button>

      <Heading>Company Phones</Heading>
      {formData.companyPhones?.map((phone, index) => (
        <div key={index} className="flex flex-col items-end gap-2 sm:flex-row">
          <Input
            label={`Phone ${index + 1}`}
            value={phone.title}
            onChange={handleArrayChange(index, "companyPhones", "title")}
          />
          <Input
            label="Phone Href"
            value={phone.href}
            onChange={handleArrayChange(index, "companyPhones", "href")}
          />
          <Button
            type="button"
            onClick={() => removeField(index, "companyPhones")}
          >
            <LuTrash />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => addField("companyPhones", { title: "", href: "" })}
      >
        Add Phone
      </Button>

      <Heading className="pt-3">Company Email</Heading>
      {formData.companyEmail?.map((email, index) => (
        <div key={index} className="flex flex-col items-end gap-2 sm:flex-row">
          <Input
            label={`Email ${index + 1}`}
            value={email.title}
            onChange={handleArrayChange(index, "companyEmail", "title")}
          />
          <Input
            label="Email Href"
            value={email.href}
            onChange={handleArrayChange(index, "companyEmail", "href")}
          />
          <Button
            type="button"
            onClick={() => removeField(index, "companyEmail")}
          >
            <LuTrash />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => addField("companyEmail", { title: "", href: "" })}
      >
        Add Email
      </Button>

      <SEOForm
        seo={formData.seo}
        onChange={(updatedSeo) => setFormData({ ...formData, seo: updatedSeo })}
      />

      <Button type="submit" className="w-full !mt-10 py-6 text-lg">
        Save All Changes
      </Button>
    </Card>
  );
};

export default Home;