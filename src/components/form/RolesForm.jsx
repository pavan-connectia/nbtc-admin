import React, { useState, useEffect } from "react";
import { Modal, Input, ButtonGroup, DepartmentDD, Label, Select } from "..";
import { useCreateUserMutation, useUpdateUserMutation } from "@/redux/api/auth";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const RolesForm = ({ isOpen, onClose, user }) => {
  const { department, role } = useSelector((state) => state.auth);
  const [postUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  
  const initialState = {
    name: "",
    email: "",
    password: "",
    role: "",
    department: role === "admin" ? department : "",
    permissions: {
      create: false,
      read: false,
      update: false,
      delete: false,
    },
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const id = e?.target ? e.target.id : null;
    const value = e?.target ? e.target.value : e;

    if (!id) return;

    if (id === "role" && value === "admin") {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
        permissions: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleNestedChange = (e) => {
    const { id, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, [id]: checked },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = { ...formData };

      if (user && !payload.password) {
        delete payload.password;
      }

      if (!payload.department || payload.department === "") {
        delete payload.department;
      }

      user
        ? await updateUser({ id: user._id, ...payload }).unwrap()
        : await postUser(payload).unwrap();

      toast.success(`User ${user ? "updated" : "created"} successfully`);
      setFormData(initialState);
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        password: "", 
      });
    } else {
      setFormData(initialState);
    }
  }, [user, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      modalTitle={`${user ? "Edit" : "New"} User`}
      modalDescription="Make changes to the user here. Click save when you're done."
      onClose={onClose}
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
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
          onChange={handleChange}
        />

        <div>
          <Label id="role">Roles</Label>
          <Select
            id="role"
            value={formData.role}
            onChange={handleChange}
            options={[
              { key: "admin", value: "admin", label: "Admin" },
              { key: "user", value: "user", label: "User" },
            ]}
          />
        </div>

        {formData?.role === "user" && (
          <div className="space-y-3">
            <Label>Permissions</Label>
            <div className="flex flex-wrap justify-between">
              {["create", "read", "update", "delete"].map((perm) => (
                <div key={perm} className="flex items-center gap-2">
                  <Input
                    type="checkbox"
                    id={perm}
                    checked={formData.permissions[perm]}
                    onChange={handleNestedChange}
                  />
                  <Label id={perm}>
                    {perm.charAt(0).toUpperCase() + perm.slice(1)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {role === "superadmin" && formData?.role !== "superadmin" && (
          <DepartmentDD 
            id="department" 
            value={formData.department} 
            onChange={(val) => handleChange({ target: { id: "department", value: val?.target ? val.target.value : val } })} 
          />
        )}

        <ButtonGroup negativeClick={onClose} />
      </form>
    </Modal>
  );
};

export default RolesForm;