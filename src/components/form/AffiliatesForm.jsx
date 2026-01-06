import React, { useState, useEffect } from "react";
import {
  Input,
  ImageUpload,
  TextArea,
  Index,
  Display,
  ButtonGroup,
  Form,
} from "..";
import {
  usePostAffiliatesMutation,
  useUpdateAffiliatesMutation,
} from "@/redux/api/affiliates";
import { toast } from "sonner";

const AffiliatesForm = ({ onClose, affiliates }) => {
  const initialState = {
    image: "",
    name: { en: "", ar: "" },
    description: { en: "", ar: "" },
    link: "",
    display: true,
    index: 0,
  };
  const [formData, setFormData] = useState(initialState);

  const [postAffiliates] = usePostAffiliatesMutation();
  const [updateAffiliates] = useUpdateAffiliatesMutation();

  useEffect(() => {
    setFormData(affiliates ? affiliates : initialState);
  }, [affiliates]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleNestedChange = (e, field) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [field]: { ...formData[field], [id]: value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      affiliates
        ? await updateAffiliates({ id: affiliates._id, ...formData }).unwrap()
        : await postAffiliates(formData).unwrap();

      toast.success(
        `Affiliate ${affiliates ? "updated" : "created"}  successfully`,
      );
      setFormData(initialState);

      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Form
      formTitle={`${affiliates ? "Edit" : "New"} Affiliate`}
      formDescription="Make changes to the affiliate here. Click save when you're done."
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <Input
          id="en"
          label="Name (EN)"
          value={formData.name.en}
          onChange={(e) => handleNestedChange(e, "name")}
        />

        <Input
          id="ar"
          label="Name (AR)"
          value={formData.name.ar}
          onChange={(e) => handleNestedChange(e, "name")}
        />

        <ImageUpload
          imageUrl={formData?.image}
          uploadUrl={"/uploads/affiliates"}
          title={formData.name.en}
          onUploadSuccess={(filePath) =>
            setFormData({ ...formData, image: filePath })
          }
        />

        <TextArea
          id="en"
          label="Description (EN)"
          value={formData.description.en}
          rows={7}
          onChange={(e) => handleNestedChange(e, "description")}
        />

        <TextArea
          id="ar"
          label="Description (AR)"
          value={formData.description.ar}
          rows={7}
          onChange={(e) => handleNestedChange(e, "description")}
        />

        <Input
          id="link"
          label="Link"
          value={formData.link}
          onChange={handleChange}
        />

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

export default AffiliatesForm;
