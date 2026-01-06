import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Heading,
  ImageUpload,
  Input,
  Label,
  Select,
  SEOForm,
  Text,
  TextArea,
  TextEditor,
} from "@/components";
import {
  useGetHomeDeptByIdQuery,
  useUpdateHomeDeptMutation,
} from "@/redux/api/homeDept";
import { LuTrash } from "react-icons/lu";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const HomeDept = () => {
  const { department } = useSelector((state) => state.auth);
  const { data, isSuccess } = useGetHomeDeptByIdQuery(department);
  const [id, setId] = useState("");
  const [updateHome] = useUpdateHomeDeptMutation();

  const initialFormState = {
    heroType: "",
    video: "",
    banner: "",
    heading: { en: "", ar: "" },
    description: { en: "", ar: "" },
    learnMore: "",
    sliderVisible: true,
    slider: [
      {
        image: "",
        heading: { en: "", ar: "" },
        description: { en: "", ar: "" },
        learnMore: "",
      },
    ],
    statistics: [{ number: "", text: { en: "", ar: "" } }],
    journey: { en: "", ar: "" },
    mission: { en: "", ar: "" },
    value: { en: "", ar: "" },
    vision: { en: "", ar: "" },
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
      setFormData({
        ...initialFormState,
        ...homeData,
      });
    }
  }, [isSuccess, data]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const newValue = id === "display" ? value === "true" : value;
    setFormData((prev) => ({ ...prev, [id]: newValue }));
  };

  const handleNestedChange = (parentKey, key) => (content) => {
    setFormData((prevData) => ({
      ...prevData,
      [parentKey]: {
        ...prevData[parentKey],
        [key]: content,
      },
    }));
  };

  const handleArrayChange =
    (index, field, name, subField = null) =>
      (e) => {
        const { value } = e.target;
        setFormData((prevData) => {
          const updatedArray = [...prevData[field]];
          if (subField) {
            updatedArray[index] = {
              ...updatedArray[index],
              [subField]: { ...updatedArray[index][subField], [name]: value },
            };
          } else {
            updatedArray[index] = { ...updatedArray[index], [name]: value };
          }
          return { ...prevData, [field]: updatedArray };
        });
      };

  const addField = (field, newEntry) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: [...prevData[field], newEntry],
    }));
  };

  const removeField = (index, field) => {
    setFormData((prevData) => {
      const updatedArray = prevData[field].filter((_, i) => i !== index);
      return { ...prevData, [field]: updatedArray };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      console.error("ID is missing");
      return;
    }
    try {
      await updateHome({ id, ...formData }).unwrap();
      toast.success("Home data updated successfully");
    } catch (error) {
      console.log(error);
      console.error("Update failed", error);
    }
  };



  return (
    <Card
      className="p-5 space-y-3 rounded-lg"
      as="form"
      onSubmit={handleSubmit}
    >
      <Heading>Home Page</Heading>
      <Text>Manage home page content. Click save when done.</Text>

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

      {formData?.heroType === "slider" ? (
        <>
          {formData?.slider?.map((slide, index) => (
            <div key={index} className="space-y-2">
              <ImageUpload
                label={`Slider ${index + 1} Banner`}
                uploadUrl="/uploads/banner"
                value={slide.image}
                imageUrl={slide.image}
                onUploadSuccess={(filePath) =>
                  handleArrayChange(
                    index,
                    "slider",
                    "image",
                  )({
                    target: { value: filePath },
                  })
                }
              />
              <TextEditor
                label={`Slider ${index + 1} Heading (EN)`}
                value={slide.heading.en}
                onChange={(content) =>
                  handleArrayChange(
                    index,
                    "slider",
                    "en",
                    "heading",
                  )({
                    target: { value: content },
                  })
                }
              />

              <TextEditor
                label={`Slider ${index + 1} Heading (AR)`}
                value={slide.heading.ar}
                onChange={(content) =>
                  handleArrayChange(
                    index,
                    "slider",
                    "ar",
                    "heading",
                  )({
                    target: { value: content },
                  })
                }
              />

              <TextEditor
                label={`Slider ${index + 1} Description (EN)`}
                value={slide.description.en}
                onChange={(content) =>
                  handleArrayChange(
                    index,
                    "slider",
                    "en",
                    "description",
                  )({
                    target: { value: content },
                  })
                }
              />

              <TextEditor
                label={`Slider ${index + 1} Description (AR)`}
                value={slide.description.ar}
                onChange={(content) =>
                  handleArrayChange(
                    index,
                    "slider",
                    "ar",
                    "description",
                  )({
                    target: { value: content },
                  })
                }
              />

              <Input
                id="learnMore"
                label={`Slider ${index + 1} Learn More`}
                value={slide.learnMore}
                onChange={handleArrayChange(index, "slider", "learnMore")}
              />

              <Button onClick={() => removeField(index, "slider")}>
                Remove Slide
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault(); // Prevent default form behavior
              addField("slider", {
                image: "",
                heading: { en: "", ar: "" },
                description: { en: "", ar: "" },
                learnMore: "",
              });
            }}
          >
            Add Slide
          </Button>
        </>
      ) : (
        <>
          {formData?.heroType === "image" ? (
            <ImageUpload
              label="Banner"
              uploadUrl="/uploads/banner"
              value={formData.banner}
              imageUrl={formData?.banner}
              onUploadSuccess={(filePath) =>
                setFormData({ ...formData, banner: filePath })
              }
            />
          ) : (
            <>
              {formData?.video && (
                <video
                  src={`${import.meta.env.VITE_API_BASE_URL}/${formData?.video}`}
                  controls
                  className="object-contain w-32 h-32 mb-2 border rounded"
                />
              )}

              <Input
                type="file"
                accept="video/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    const response = await upload({
                      image: formData,
                      folder: "/uploads/videos",
                      title: title,
                    }).unwrap();
                    setFormData({ ...formData, video: response.filePath });
                  } catch (error) {
                    console.error("Video upload failed", error);
                  }
                }}
              />
            </>
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
        </>
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

      <Button type="submit" className="!my-10 w-full">
        Save Changes
      </Button>
    </Card>
  );
};

export default HomeDept;
