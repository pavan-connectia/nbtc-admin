import React, { useState, useEffect } from "react";
import {
  useGetAboutusDeptQuery,
  useUpdateAboutusDeptMutation,
} from "@/redux/api/aboutusDept";
import {
  Heading,
  Button,
  Card,
  TextEditor,
  ImageUpload,
  Input,
  Text,
  SEOForm,
} from "@/components";
import { toast } from "sonner";
import { LuTrash } from "react-icons/lu";
import { useSelector } from "react-redux";

const initialFormState = {
  profile: {
    description: { en: "", ar: "" },
    description2: { en: "", ar: "" },
    description3: { en: "", ar: "" },
    image: "",
    image2: "",
    quote: { en: "", ar: "" },
  },
  chairmanMsg: {
    quote: { en: "", ar: "" },
    image: "",
    message: { en: "", ar: "" },
    name: { en: "", ar: "" },
    smallQuote: { en: "", ar: "" },
  },
  mdMsg: {
    quote: { en: "", ar: "" },
    image: "",
    message: { en: "", ar: "" },
    name: { en: "", ar: "" },
    smallQuote: { en: "", ar: "" },
  },
  management: [
    {
      name: { en: "", ar: "" },
      image: "",
      designation: { en: "", ar: "" },
    },
  ],
  seo: {
    title: "",
    metaDescription: "",
    metaKeywords: "",
    ogImage: "",
    ogUrl: "",
    canonicalUrl: "",
  },
};

const AboutusDept = () => {
  const { department } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState(initialFormState);
  const [id, setId] = useState(null);

  const { data, isSuccess } = useGetAboutusDeptQuery(department);
  const [updateAboutus] = useUpdateAboutusDeptMutation();

  useEffect(() => {
    if (isSuccess && data?.data) {
      const aboutusData = data?.data;
      if (aboutusData?._id) setId(aboutusData._id);
      setFormData({
        ...initialFormState,
        ...aboutusData,
      });
    }
  }, [isSuccess, data]);

  const handleNestedChange = (field, subfield) => (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        [subfield]: {
          ...prevData[field][subfield],
          [e.target.name]: value,
        },
      },
    }));
  };

const handleArrayChange = (field, index, e) => {
  const { name, value } = e.target;
  const keys = name.split("."); 

  setFormData((prev) => {
    const updated = [...prev[field]];
    let obj = updated[index];

    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }

    obj[keys[keys.length - 1]] = value;

    return {
      ...prev,
      [field]: updated,
    };
  });
};

  const addField = (field, emptyObj) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: [...prevData[field], emptyObj],
    }));
  };

  const removeField = (index, field) => {
    const newFieldArray = [...formData[field]];
    if (index >= 0 && index < newFieldArray.length) {
      newFieldArray.splice(index, 1);
      setFormData((prevData) => ({
        ...prevData,
        [field]: newFieldArray,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      console.error("ID is missing");
      return;
    }
    try {
      await updateAboutus({ id, ...formData }).unwrap();
      toast.success("About us updated successfully");
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update About us");
    }
  };

  return (
    <>
      <Card
        as="form"
        onSubmit={handleSubmit}
        className="space-y-3 rounded-lg p-5"
      >
        <Heading>About Us Page</Heading>
        <Text>
          Make changes to the about us page here. Click save when you're done.
        </Text>

        {/* Profile Section */}
        <div className="space-y-5">
          <ImageUpload
            id="profile-image"
            label="Profile Image"
            value={formData.profile.image}
            uploadUrl="/uploads/aboutus"
            imageUrl={formData?.profile?.image}
            onUploadSuccess={(filePath) =>
              setFormData({
                ...formData,
                profile: { ...formData.profile, image: filePath },
              })
            }
          />
          <TextEditor
            id="profile-description-en"
            label="Profile Description (EN)"
            value={formData.profile.description.en}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                profile: {
                  ...prevData.profile,
                  description: {
                    ...prevData.profile.description,
                    en: value,
                  },
                },
              }))
            }
          />

          <TextEditor
            id="profile-description-ar"
            label="Profile Description (AR)"
            value={formData.profile.description.ar}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                profile: {
                  ...prevData.profile,
                  description: {
                    ...prevData.profile.description,
                    ar: value,
                  },
                },
              }))
            }
          />

          <TextEditor
            id="profile-description2-en"
            label="Profile Description 2 (EN)"
            value={formData.profile?.description2?.en || ""}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                profile: {
                  ...prevData.profile,
                  description2: {
                    ...prevData.profile.description2,
                    en: value,
                  },
                },
              }))
            }
          />

          <TextEditor
            id="profile-description2-ar"
            label="Profile Description 2 (AR)"
            value={formData.profile?.description2?.ar || ""}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                profile: {
                  ...prevData.profile,
                  description2: {
                    ...prevData.profile.description2,
                    ar: value,
                  },
                },
              }))
            }
          />

          <TextEditor
            id="profile-description3-en"
            label="Profile Description (EN)"
            value={formData.profile?.description3?.en || ""}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                profile: {
                  ...prevData.profile,
                  description3: {
                    ...prevData.profile.description3,
                    en: value,
                  },
                },
              }))
            }
          />

          <TextEditor
            id="profile-description3-ar"
            label="Profile Description (AR)"
            value={formData.profile?.description3?.ar || ""}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                profile: {
                  ...prevData.profile,
                  description3: {
                    ...prevData.profile.description3,
                    ar: value,
                  },
                },
              }))
            }
          />

          <ImageUpload
            id="profile-image2"
            label="Profile Image"
            value={formData.profile.image2}
            uploadUrl="/uploads/aboutus"
            imageUrl={formData?.profile?.image2}
            onUploadSuccess={(filePath) =>
              setFormData({
                ...formData,
                profile: { ...formData.profile, image2: filePath },
              })
            }
          />

          <TextEditor
            id="profile-quote-en"
            label="Profile Quote (EN)"
            value={formData.profile.quote.en}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                profile: {
                  ...prevData.profile,
                  quote: {
                    ...prevData.profile.quote,
                    en: value,
                  },
                },
              }))
            }
          />
          <TextEditor
            id="profile-quote-ar"
            label="Profile Quote (AR)"
            value={formData.profile.quote.ar}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                profile: {
                  ...prevData.profile,
                  quote: {
                    ...prevData.profile.quote,
                    ar: value,
                  },
                },
              }))
            }
          />
        </div>

        {/* Chairman Section */}
        <div className="space-y-3">
          <Heading>Chairman Message</Heading>
          <TextEditor
            id="chairman-quote-en"
            label="Chairman Quote (EN)"
            value={formData.chairmanMsg.quote.en}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                chairmanMsg: {
                  ...prevData.chairmanMsg,
                  quote: {
                    ...prevData.chairmanMsg.quote,
                    en: value,
                  },
                },
              }))
            }
          />
          <TextEditor
            id="chairman-quote-ar"
            label="Chairman Quote (AR)"
            value={formData.chairmanMsg.quote.ar}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                chairmanMsg: {
                  ...prevData.chairmanMsg,
                  quote: {
                    ...prevData.chairmanMsg.quote,
                    ar: value,
                  },
                },
              }))
            }
          />
          <ImageUpload
            id="chairman-image"
            label="Chairman Image"
            value={formData.chairmanMsg.image}
            uploadUrl="/uploads/aboutus"
            imageUrl={formData?.chairmanMsg?.image}
            className="h-[15rem] object-contain"
            onUploadSuccess={(filePath) =>
              setFormData({
                ...formData,
                chairmanMsg: { ...formData.chairmanMsg, image: filePath },
              })
            }
          />
          <TextEditor
            id="chairman-message-en"
            label="Chairman Message (EN)"
            value={formData.chairmanMsg.message.en}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                chairmanMsg: {
                  ...prevData.chairmanMsg,
                  message: {
                    ...prevData.chairmanMsg.message,
                    en: value,
                  },
                },
              }))
            }
          />
          <TextEditor
            id="chairman-message-ar"
            label="Chairman Message (AR)"
            value={formData.chairmanMsg.message.ar}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                chairmanMsg: {
                  ...prevData.chairmanMsg,
                  message: {
                    ...prevData.chairmanMsg.message,
                    ar: value,
                  },
                },
              }))
            }
          />
          <Input
            id="chairman-name-en"
            label="Chairman Name (EN)"
            value={formData.chairmanMsg.name.en}
            onChange={handleNestedChange("chairmanMsg", "name")}
          />
          <Input
            id="chairman-name-ar"
            label="Chairman Name (AR)"
            value={formData.chairmanMsg.name.ar}
            onChange={handleNestedChange("chairmanMsg", "name")}
          />
          <TextEditor
            id="chairman-smallQuote-en"
            label="Chairman Small Quote (EN)"
            value={formData.chairmanMsg.smallQuote.en}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                chairmanMsg: {
                  ...prevData.chairmanMsg,
                  smallQuote: {
                    ...prevData.chairmanMsg.smallQuote,
                    en: value,
                  },
                },
              }))
            }
          />
          <TextEditor
            id="chairman-smallQuote-ar"
            label="Chairman Small Quote (AR)"
            value={formData.chairmanMsg.smallQuote.ar}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                chairmanMsg: {
                  ...prevData.chairmanMsg,
                  smallQuote: {
                    ...prevData.chairmanMsg.smallQuote,
                    ar: value,
                  },
                },
              }))
            }
          />
        </div>

        <div className="space-y-3">
          <Heading>Md Message</Heading>
          <TextEditor
            id="md-quote-en"
            label="Md Quote (EN)"
            value={formData.mdMsg.quote.en}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                mdMsg: {
                  ...prevData.mdMsg,
                  quote: {
                    ...prevData.mdMsg.quote,
                    en: value,
                  },
                },
              }))
            }
          />

          <TextEditor
            id="md-quote-ar"
            label="Md Quote (AR)"
            value={formData.mdMsg.quote.ar}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                mdMsg: {
                  ...prevData.mdMsg,
                  quote: {
                    ...prevData.mdMsg.quote,
                    ar: value,
                  },
                },
              }))
            }
          />

          <ImageUpload
            id="md-image"
            label="Md Image"
            value={formData.mdMsg.image}
            uploadUrl="/uploads/aboutus"
            imageUrl={formData?.mdMsg?.image}
            className="h-[15rem] object-contain"
            onUploadSuccess={(filePath) =>
              setFormData({
                ...formData,
                mdMsg: { ...formData.mdMsg, image: filePath },
              })
            }
          />

          <TextEditor
            id="md-message-en"
            label="Md Message (EN)"
            value={formData.mdMsg.message.en}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                mdMsg: {
                  ...prevData.mdMsg,
                  message: {
                    ...prevData.mdMsg.message,
                    en: value,
                  },
                },
              }))
            }
          />

          <TextEditor
            id="md-message-ar"
            label="Md Message (AR)"
            value={formData.mdMsg.message.ar}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                mdMsg: {
                  ...prevData.mdMsg,
                  message: {
                    ...prevData.mdMsg.message,
                    ar: value,
                  },
                },
              }))
            }
          />

          <Input
            id="md-name-en"
            label="Md Name (EN)"
            value={formData.mdMsg.name.en}
            onChange={handleNestedChange("mdMsg", "name")}
          />
          <Input
            id="md-name-ar"
            label="Md Name (AR)"
            value={formData.chairmanMsg.name.ar}
            onChange={handleNestedChange("chairmanMsg", "name")}
          />
          <TextEditor
            id="md-smallQuote-en"
            label="Md Small Quote (EN)"
            value={formData.mdMsg.smallQuote.en}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                mdMsg: {
                  ...prevData.mdMsg,
                  smallQuote: {
                    ...prevData.mdMsg.smallQuote,
                    en: value,
                  },
                },
              }))
            }
          />

          <TextEditor
            id="md-smallQuote-ar"
            label="Md Small Quote (AR)"
            value={formData.mdMsg.smallQuote.ar}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                mdMsg: {
                  ...prevData.mdMsg,
                  smallQuote: {
                    ...prevData.mdMsg.smallQuote,
                    ar: value,
                  },
                },
              }))
            }
          />
        </div>

        {/* Management Section */}
        <div className="pt-5">
          <Heading>Management Team</Heading>

          {formData.management.map((member, index) => (
            <div key={index} className="mb-4 rounded-md border p-3">
              <Input
                label="Management Member Name (EN)"
                name="name.en"
                value={member.name.en}
                onChange={(e) => handleArrayChange("management", index, e)}
              />
              <Input
                label="Management Member Name (AR)"
                name="name.ar"
                value={member.name.ar}
                onChange={(e) => handleArrayChange("management", index, e)}
              />
              <Input
                label="Management Member Designation (EN)"
                name="designation.en"
                value={member.designation.en}
                onChange={(e) => handleArrayChange("management", index, e)}
              />
              <Input
                label="Management Member Designation (AR)"
                name="designation.ar"
                value={member.designation.ar}
                onChange={(e) => handleArrayChange("management", index, e)}
              />
              <ImageUpload
                label="Management Member Image"
                value={member.image}
                uploadUrl="/uploads/aboutus"
                onUploadSuccess={(filePath) => {
                  const updatedMembers = formData.management.map((m, i) =>
                    i === index ? { ...m, image: filePath } : m,
                  );
                  setFormData((prevData) => ({
                    ...prevData,
                    management: updatedMembers,
                  }));
                }}
                imageUrl={member.image}
              />
              <Button
                type="button"
                onClick={() => removeField(index, "management")}
                className="mt-2"
                size="sm"
              >
                <LuTrash />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            className="mb-5"
            size="sm"
            onClick={() =>
              addField("management", {
                name: { en: "", ar: "" },
                image: "",
                designation: { en: "", ar: "" },
              })
            }
          >
            Add Management Member
          </Button>
        </div>

        <SEOForm
          seo={formData.seo}
          onChange={(updatedSeo) =>
            setFormData({ ...formData, seo: updatedSeo })
          }
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Save
        </Button>
      </Card>
    </>
  );
};

export default AboutusDept;
