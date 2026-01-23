import React, { useState, useEffect } from "react";
import {
  useGetSupportServiceQuery,
  useUpdateSupportServiceMutation,
} from "../redux/api/supportService";
import {
  Button,
  Card,
  Heading,
  ImageUpload,
  Label,
  TextEditor,
  Input,
  Text,
} from "../components";
import { LuTrash } from "react-icons/lu";
import { toast } from "sonner";

const SupportService = () => {
  const { data, isSuccess } = useGetSupportServiceQuery();
  const [id, setId] = useState("");
  const [updateService] = useUpdateSupportServiceMutation();

  const [serviceImage, setServiceImage] = useState("");
  const [adminHr, setAdminHr] = useState({
    subHeading: { en: "", ar: "" },
    features: [
      { image: "", title: { en: "", ar: "" }, description: { en: "", ar: "" } },
    ],
  });
  const [financeAccounts, setFinanceAccounts] = useState({ en: "", ar: "" });
  const [materialManagement, setMaterialManagement] = useState({
    image: "",
    description: { en: "", ar: "" },
  });
  const [bist, setBist] = useState({ en: "", ar: "" });
  const [grc, setGrc] = useState({ en: "", ar: "" });

  useEffect(() => {
    if (isSuccess && data?.data) {
      const serviceData = data?.data || {};
      if (serviceData?._id) setId(serviceData._id);

      setServiceImage(serviceData.image || "");
      setAdminHr((prevData) => ({
        ...prevData,
        subHeading: serviceData.adminHr?.subHeading || { en: "", ar: "" },
        features: serviceData.adminHr?.features || [
          {
            image: "",
            title: { en: "", ar: "" },
            description: { en: "", ar: "" },
          },
        ],
      }));
      setFinanceAccounts(serviceData.finaceAccoutns || { en: "", ar: "" });
      setMaterialManagement({
        image: serviceData.materialManagement?.image || "",
        description: serviceData.materialManagement?.description || {
          en: "",
          ar: "",
        },
      });
      setBist(serviceData.bist || { en: "", ar: "" });
      setGrc(serviceData.grc || { en: "", ar: "" });
    }
  }, [isSuccess, data]);

  const handleFeatureChange = (index, name, value) => {
    setAdminHr((prevData) => {
      const updatedFeatures = prevData.features.map((feature, i) => {
        if (i === index) {
          return { ...feature, [name]: value };
        }
        return feature;
      });
      return {
        ...prevData,
        features: updatedFeatures,
      };
    });
  };

  const handleChange = (field, lang, value) => {
    setAdminHr((prevData) => ({
      ...prevData,
      [field]: { ...prevData[field], [lang]: value },
    }));
  };

  const addFeature = () => {
    setAdminHr((prevData) => ({
      ...prevData,
      features: [
        ...prevData.features,
        {
          image: "",
          title: { en: "", ar: "" },
          description: { en: "", ar: "" },
        },
      ],
    }));
  };

  const removeFeature = (index) => {
    setAdminHr((prevData) => ({
      ...prevData,
      features: prevData.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      console.error("ID is missing");
      return;
    }
    try {
      await updateService({
        id,
        image: serviceImage,
        adminHr,
        financeAccounts,
        materialManagement,
        bist,
        grc,
      }).unwrap();

      toast.success("Support service updated successfully");
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <>
      <Card
        as="form"
        onSubmit={handleSubmit}
        className="space-y-3 rounded-lg p-5"
      >
        <Heading>Support Function</Heading>
        <Text>
          Make changes to the support service page here. Click save when you're
          done.
        </Text>

        <ImageUpload
          label="Support Function Header Image"
          uploadUrl="/uploads/services"
          value={serviceImage}
          imageUrl={serviceImage}
          className="h-[12rem]"
          onUploadSuccess={(filePath) => setServiceImage(filePath)}
        />

        <Heading>Admin HR</Heading>

        <TextEditor
          label={"Sub Heading ( English )"}
          value={adminHr.subHeading.en}
          onChange={(value) => handleChange("subHeading", "en", value)}
          className="pb-5"
        />

        <TextEditor
          value={adminHr.subHeading.ar}
          label={"Sub Heading ( Arabic )"}
          onChange={(value) => handleChange("subHeading", "ar", value)}
          className="pb-5"
          direction="ltr"
        />

        <div className="flex w-full items-center justify-between pt-10">
          <Heading>Features</Heading>
          <Button onClick={addFeature} size="sm">
            Add Feature
          </Button>
        </div>

        {adminHr.features.map((feature, index) => (
          <div key={index} className="!mb-10 space-y-3">
            <ImageUpload
              label={`Service Image ${index + 1}`}
              uploadUrl="/uploads/services"
              imageUrl={feature.image}
              value={feature.image}
              className="h-[10rem] overflow-hidden object-contain"
              onUploadSuccess={(filePath) => {
                const updatedFeatures = adminHr.features.map((f, i) =>
                  i === index ? { ...f, image: filePath } : f,
                );
                setAdminHr((prevData) => ({
                  ...prevData,
                  features: updatedFeatures,
                }));
              }}
            />

            <Input
              id={`Service Title ${index + 1} (EN)`}
              value={feature.title.en}
              label={`Service Title ${index + 1} (EN)`}
              onChange={(e) =>
                handleFeatureChange(index, "title", {
                  ...feature.title,
                  en: e.target.value,
                })
              }
            />

            <Input
              id={`Service Title ${index + 1} (AR)`}
              value={feature.title.ar}
              label={`Service Title ${index + 1} (AR)`}
              onChange={(e) =>
                handleFeatureChange(index, "title", {
                  ...feature.title,
                  ar: e.target.value,
                })
              }
            />

            <TextEditor
              value={feature.description.en}
              onChange={(value) =>
                handleFeatureChange(index, "description", {
                  ...feature.description,
                  en: value,
                })
              }
              label={`Service Description ${index + 1} (EN)`}
            />

            <TextEditor
              value={feature.description.ar}
              onChange={(value) =>
                handleFeatureChange(index, "description", {
                  ...feature.description,
                  ar: value,
                })
              }
              label={`Service Description ${index + 1} (AR)`}
            />

            <Button onClick={() => removeFeature(index)} className="mt-3">
              <LuTrash />
            </Button>
          </div>
        ))}

        <Label>Finance Accounts</Label>
        <TextEditor
          value={financeAccounts.en}
          onChange={(value) =>
            setFinanceAccounts({ ...financeAccounts, en: value })
          }
          label="Description (EN)"
        />
        <TextEditor
          value={financeAccounts.ar}
          onChange={(value) =>
            setFinanceAccounts({ ...financeAccounts, ar: value })
          }
          label="Description (AR)"
        />

        <Heading>Material Management</Heading>
        <ImageUpload
          label={"Material Management Image"}
          uploadUrl="/uploads/services"
          value={materialManagement.image}
          imageUrl={materialManagement.image}
          className="h-[10rem]"
          onUploadSuccess={(filePath) =>
            setMaterialManagement((prevData) => ({
              ...prevData,
              image: filePath,
            }))
          }
        />

        <Heading>Description</Heading>
        <TextEditor
          value={materialManagement.description.en}
          label={"Description (EN)"}
          onChange={(value) =>
            setMaterialManagement((prevData) => ({
              ...prevData,
              description: { ...prevData.description, en: value },
            }))
          }
        />

        <TextEditor
          value={materialManagement.description.ar}
          label={"Description (AR)"}
          onChange={(value) =>
            setMaterialManagement((prevData) => ({
              ...prevData,
              description: { ...prevData.description, ar: value },
            }))
          }
        />

        <Heading>BIST</Heading>
        <TextEditor
          value={bist.en}
          label={"Descritpion (EN)"}
          onChange={(value) => setBist((prev) => ({ ...prev, en: value }))}
        />

        <TextEditor
          value={bist.ar}
          label={"Descritpion (AR)"}
          onChange={(value) => setBist((prev) => ({ ...prev, ar: value }))}
        />

        <Heading>Governance, Risk & Compliance</Heading>
        <TextEditor
          value={grc.en}
          label={"Descritpion (EN)"}
          onChange={(value) => setGrc((prev) => ({ ...prev, en: value }))}
        />

        <TextEditor
          value={grc.ar}
          label={"Descritpion (AR)"}
          onChange={(value) => setGrc((prev) => ({ ...prev, ar: value }))}
        />

        <Button type="submit" className="w-full">
          Save
        </Button>
      </Card>
    </>
  );
};

export default SupportService;
