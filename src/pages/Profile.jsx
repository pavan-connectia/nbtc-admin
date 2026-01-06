import React, { useState, useEffect } from "react";
import { Heading, Button, Card, Input, Text } from "../components";
import { toast } from "sonner";
import {
  useGetUserByTokenQuery,
  useUpdateUserByTokenMutation,
} from "../redux/api/auth";

const initialFormState = {
  name: "",
  email: "",
  password: "",
};

const Profile = () => {
  const [formData, setFormData] = useState(initialFormState);
  const { data, isSuccess } = useGetUserByTokenQuery();
  const [updateUser] = useUpdateUserByTokenMutation();

  useEffect(() => {
    if (isSuccess && data) {
      setFormData({
        name: data?.data?.name || "",
        email: data?.data?.email || "",
        password: "",
      });
    }
  }, [isSuccess, data]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = { ...formData };
    if (!formData.password) {
      delete updatedData.password;
    }

    try {
      await updateUser(updatedData).unwrap();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Card
        as="form"
        onSubmit={handleSubmit}
        className="space-y-3 rounded-lg p-5"
      >
        <Heading>Profile</Heading>
        <Text>
          Make changes to the profile here. Click save when you're done.
        </Text>

        <Input
          id="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <Input
          id="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          id="password"
          label="Password"
          value={formData.password}
          placeholder="Enter new password if you want to change it"
          onChange={handleChange}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Save
        </Button>
      </Card>
    </>
  );
};

export default Profile;
