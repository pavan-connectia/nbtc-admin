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
      setId(homeData._id || "");
      
      // Merge API data with initial state to ensure all keys exist
      setFormData({
        ...initialFormState,
        ...homeData,
        // Ensure nested objects are preserved if they don't exist in API
        heading: homeData.heading || initialFormState.heading,
        description: homeData.description || initialFormState.description,
        journey: homeData.journey || initialFormState.journey,
        mission: homeData.mission || initialFormState.mission,
        vision: homeData.vision || initialFormState.vision,
        value: homeData.value || initialFormState.value,
        seo: homeData.seo || initialFormState.seo,
      });
    }
  }, [isSuccess, data]);

  // Standard Input Change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Nested Object Change (e.g., heading.en)
  const handleNestedChange = (parentKey, lang) => (content) => {
    const value = content?.target ? content.target.value : content;
    setFormData((prev) => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey] || {}),
        [lang]: value,
      },
    }));
  };

  // Array of Objects Change (e.g., statistics[0].text.en)
  const handleArrayChange = (index, arrayField, key, subKey = null) => (e) => {
    const value = e?.target ? e.target.value : e;
    setFormData((prev) => {
      const updatedArray = [...prev[arrayField]];
      if (subKey) {
        // For structure like: statistics[index].text.en
        updatedArray[index] = {
          ...updatedArray[index],
          [subKey]: { 
            ...(updatedArray[index][subKey] || {}), 
            [key]: value 
          },
        };
      } else {
        // For structure like: companyPhones[index].title
        updatedArray[index] = { 
          ...updatedArray[index], 
          [key]: value 
        };
      }
      return { ...prev, [arrayField]: updatedArray };
    });
  };

  const addField = (field, newEntry) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), newEntry],
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
    uploadData.append("folder", "videos");

    try {
      const response = await upload(uploadData).unwrap();
      setFormData((prev) => ({ ...prev, video: response.filePath }));
      toast.success("Video uploaded");
    } catch (error) {
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

  if (isLoading) return <p className="p-10 text-center">Loading...</p>;

  return (
    <Card as="form" onSubmit={handleSubmit} className="p-5 space-y-6 rounded-lg">
      <div className="border-b pb-4">
        <Heading>Home Page</Heading>
        <Text>Manage home page content. Click save when done.</Text>
      </div>

      {/* Hero Section */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-md">
        <Label>Hero Type</Label>
        <Select
          value={formData.heroType}
          onChange={(e) => setFormData({ ...formData, heroType: e.target.value })}
          options={[
            { key: "video", value: "video", label: "Video" },
            { key: "image", value: "image", label: "Image" },
            { key: "slider", value: "slider", label: "Slider" },
          ]}
        />

        {formData.heroType === "slider" ? (
          <div className="space-y-6">
            {formData.slider?.map((slide, index) => (
              <div key={index} className="p-4 border rounded-md bg-white space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Slide #{index + 1}</span>
                  <Button variant="danger" onClick={() => removeField(index, "slider")}>
                    <LuTrash />
                  </Button>
                </div>
                <ImageUpload
                  label="Slide Image"
                  value={slide.image}
                  onUploadSuccess={(path) => handleArrayChange(index, "slider", "image")(path)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <TextEditor label="Heading (EN)" value={slide.heading?.en || ""} onChange={handleArrayChange(index, "slider", "en", "heading")} />
                  <TextEditor label="Heading (AR)" value={slide.heading?.ar || ""} onChange={handleArrayChange(index, "slider", "ar", "heading")} />
                </div>
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
              <div className="space-y-2 border p-3 rounded bg-white">
                <Label>Hero Video</Label>
                {formData.video && (
                  <video src={`${import.meta.env.VITE_API_BASE_URL}${formData.video}`} controls className="w-full max-h-40 rounded mb-2" />
                )}
                <Input type="file" accept="video/*" onChange={handleVideoUpload} />
              </div>
            )}
            
               <TextEditor label="Heading (EN)" value={formData.heading.en} onChange={handleNestedChange("heading", "en")} />
               <TextEditor label="Heading (AR)" value={formData.heading.ar} onChange={handleNestedChange("heading", "ar")} />
               <TextEditor label="Description (EN)" value={formData.description.en} onChange={handleNestedChange("description", "en")} />
               <TextEditor label="Description (AR)" value={formData.description.ar} onChange={handleNestedChange("description", "ar")} />
            
            <Input id="learnMore" label="Learn More URL" value={formData.learnMore} onChange={handleChange} />
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="space-y-4">
        <Heading>Statistics</Heading>
        {formData.statistics?.map((stat, index) => (
          <div key={index} className="flex flex-wrap md:flex-nowrap gap-3 items-end p-3 border rounded bg-gray-50">
            <Input
              label="Number"
              className="w-full md:w-3/4"
              value={stat.number || ""}
              onChange={handleArrayChange(index, "statistics", "number")}
            />
            <Input
              label="Text (EN)"
              className="flex-1"
              value={stat.text?.en || ""}
              onChange={handleArrayChange(index, "statistics", "en", "text")}
            />
            <Input
              label="Text (AR)"
              className="flex-1"
              value={stat.text?.ar || ""}
              onChange={handleArrayChange(index, "statistics", "ar", "text")}
            />
            <Button variant="danger" className="mb-1" onClick={() => removeField(index, "statistics")}>
              <LuTrash />
            </Button>
          </div>
        ))}
        <Button type="button" onClick={() => addField("statistics", { number: "", text: { en: "", ar: "" } })}>
          Add Statistic
        </Button>
      </div>

      {/* About Section */}
      <div className="space-y-6 pt-6 border-t">
        <Heading>About NBTC (Introduction)</Heading>
   
          <TextArea label="Journey (EN)" value={formData.journey.en} onChange={handleNestedChange("journey", "en")} />
          <TextArea label="Journey (AR)" value={formData.journey.ar} onChange={handleNestedChange("journey", "ar")} />
          <TextArea label="Mission (EN)" value={formData.mission.en} onChange={handleNestedChange("mission", "en")} />
          <TextArea label="Mission (AR)" value={formData.mission.ar} onChange={handleNestedChange("mission", "ar")} />
          <TextArea label="Vision (EN)" value={formData.vision.en} onChange={handleNestedChange("vision", "en")} />
          <TextArea label="Vision (AR)" value={formData.vision.ar} onChange={handleNestedChange("vision", "ar")} />
       
          <TextEditor label="Values (EN)" value={formData.value.en} onChange={handleNestedChange("value", "en")} />
          <TextEditor label="Values (AR)" value={formData.value.ar} onChange={handleNestedChange("value", "ar")} />
 
      </div>

      {/* Social Links */}
      
        <Heading className="col-span-full">Social Links</Heading>
        <Input id="facebookLink" label="Facebook" value={formData.facebookLink} onChange={handleChange} />
        <Input id="youtubeLink" label="YouTube" value={formData.youtubeLink} onChange={handleChange} />
        <Input id="twitterLink" label="Twitter" value={formData.twitterLink} onChange={handleChange} />
        <Input id="instagramLink" label="Instagram" value={formData.instagramLink} onChange={handleChange} />
        <Input id="linkedInLink" label="LinkedIn" value={formData.linkedInLink} onChange={handleChange} />
      

      {/* Contact Info */}
      <div className="space-y-6 border-t pt-6">
        <Heading>Company Contacts</Heading>
        
        <Label>Addresses</Label>
        {formData.companyAddress?.map((address, index) => (
          <div key={index} className="flex gap-2 items-end bg-gray-50 p-2 rounded">
            <Input label="Address (EN)" value={address.title?.en || ""} onChange={handleArrayChange(index, "companyAddress", "en", "title")} />
            <Input label="Address (AR)" value={address.title?.ar || ""} onChange={handleArrayChange(index, "companyAddress", "ar", "title")} />
            <Input label="Map Link (Href)" value={address.href || ""} onChange={handleArrayChange(index, "companyAddress", "href")} />
            <Button variant="danger" onClick={() => removeField(index, "companyAddress")}><LuTrash /></Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => addField("companyAddress", { title: { en: "", ar: "" }, href: "" })}>Add Address</Button>

     
            <div>
                <Label>Phone Numbers</Label>
                {formData.companyPhones?.map((phone, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                        <Input placeholder="Label" value={phone.title} onChange={handleArrayChange(index, "companyPhones", "title")} />
                        <Input placeholder="tel:..." value={phone.href} onChange={handleArrayChange(index, "companyPhones", "href")} />
                        <Button variant="danger" onClick={() => removeField(index, "companyPhones")}><LuTrash /></Button>
                    </div>
                ))}
                <Button type="button" className="mt-2" onClick={() => addField("companyPhones", { title: "", href: "" })}>Add Phone</Button>
            </div>
            <div>
                <Label>Emails</Label>
                {formData.companyEmail?.map((email, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                        <Input placeholder="Email" value={email.title} onChange={handleArrayChange(index, "companyEmail", "title")} />
                        <Input placeholder="mailto:..." value={email.href} onChange={handleArrayChange(index, "companyEmail", "href")} />
                        <Button variant="danger" onClick={() => removeField(index, "companyEmail")}><LuTrash /></Button>
                    </div>
                ))}
                <Button type="button" className="mt-2" onClick={() => addField("companyEmail", { title: "", href: "" })}>Add Email</Button>
            </div>
       
      </div>

      <SEOForm
        seo={formData.seo}
        onChange={(updatedSeo) => setFormData({ ...formData, seo: updatedSeo })}
      />

      <Button type="submit" className="w-full !mt-10 py-6 text-lg shadow-lg">
        Save All Home Page Changes
      </Button>
    </Card>
  );
};

export default Home;