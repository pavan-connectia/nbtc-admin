import React, { useState, useEffect } from "react";
import {
  Form,
  Label,
  Input,
  Button,
  TextArea,
  Index,
  Display,
  ButtonGroup,
} from "..";
import {
  usePostContactInfoMutation,
  useUpdateContactInfoMutation,
} from "@/redux/api/contactInfo";
import { toast } from "sonner";

const ContactInfoForm = ({ onClose, contactInfo }) => {
  const initialState = {
    title: "",
    postalAddress: "",
    physcialAddress: "",
    phone: [""],
    fax: "",
    email: "",
    website: "",
    coords: [],
    coordString: "",
    location: "",
    description: "",
    link: "",
    display: true,
    index: 0,
  };

  const [formData, setFormData] = useState(initialState);
  const [postContactInfo] = usePostContactInfoMutation();
  const [updateContactInfo] = useUpdateContactInfoMutation();

  useEffect(() => {
    if (contactInfo) {
      setFormData({
        ...contactInfo,
        coordString: contactInfo.coords?.join(", ") || "",
      });
    } else {
      setFormData(initialState);
    }
  }, [contactInfo]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const newValue = id === "display" ? JSON.parse(value) : value;
    setFormData((prev) => ({ ...prev, [id]: newValue }));
  };

  const handlePhoneChange = (index, value) => {
    const phone = [...formData.phone];
    phone[index] = value;
    setFormData((prev) => ({ ...prev, phone }));
  };

  const addPhoneNumber = () => {
    setFormData((prev) => ({
      ...prev,
      phone: [...prev.phone, ""],
    }));
  };

  const removePhoneNumber = (index) => {
    setFormData((prev) => ({
      ...prev,
      phone: prev.phone.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.coordString) {
      toast.error("Coordinates cannot be empty");
      return;
    }

    const coords = formData.coordString
      .split(",")
      .map((c) => parseFloat(c.trim()))
      .filter((c) => !isNaN(c));

    if (coords.length !== 2) {
      toast.error("Coordinates must be in 'latitude, longitude' format");
      return;
    }

    const payload = {
      ...formData,
      coords,
    };

    delete payload.coordString;

    try {
      if (contactInfo) {
        await updateContactInfo({
          id: contactInfo._id,
          ...payload, // ✅ FIXED HERE
        }).unwrap();
      } else {
        await postContactInfo(payload).unwrap();
      }

      toast.success(
        `Contact Info ${contactInfo ? "updated" : "created"} successfully`,
      );
      onClose();
      setFormData(initialState);
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <Form
      formTitle={contactInfo ? "Edit Contact Info" : "New Contact Info"}
      formDescription="Make changes to the contact info here."
      onClose={onClose}
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <Input id="title" label="Title" value={formData.title} onChange={handleChange} />

        <TextArea
          id="physcialAddress"
          label="Physical Address"
          value={formData.physcialAddress}
          onChange={handleChange}
        />

        <TextArea
          id="postalAddress"
          label="Postal Address"
          value={formData.postalAddress}
          onChange={handleChange}
        />

        <Input id="email" label="Email" value={formData.email} onChange={handleChange} />

        <div className="space-y-2">
          <Label>Phone</Label>
          {formData.phone.map((p, i) => (
            <div key={i} className="flex gap-2">
              <Input value={p} onChange={(e) => handlePhoneChange(i, e.target.value)} />
              <Button type="button" size="sm" variant="outline" onClick={() => removePhoneNumber(i)}>
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" size="sm" onClick={addPhoneNumber}>
            Add Phone Number
          </Button>
        </div>

        <Input id="fax" label="Fax" value={formData.fax} onChange={handleChange} />
        <Input id="website" label="Website" value={formData.website} onChange={handleChange} />

        <Input
          id="coordString"
          label="Coordinates"
          placeholder="29.3759, 47.9774"
          value={formData.coordString}
          onChange={handleChange}
        />

        <Input id="location" label="Location" value={formData.location} onChange={handleChange} />

        <TextArea id="description" label="Description" value={formData.description} onChange={handleChange} />
        <TextArea id="link" label="Google Map Link" value={formData.link} onChange={handleChange} />

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

export default ContactInfoForm;
