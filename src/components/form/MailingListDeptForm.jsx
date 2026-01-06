import React, { useState, useEffect } from "react";
import { Input, Modal, ButtonGroup, Label, Select } from "..";
import {
  usePostMailingListDeptMutation,
  useUpdateMailingListDeptMutation,
} from "@/redux/api/mailinglistDept";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const MailingListDeptForm = ({ isOpen, onClose, mailinglist }) => {
  const { department } = useSelector((state) => state.auth);
  const initialState = {
    email: "",
    tag: "",
    department: department,
  };
  const [formData, setFormData] = useState(initialState);

  const [postMailingList] = usePostMailingListDeptMutation();
  const [updateMailingList] = useUpdateMailingListDeptMutation();

  useEffect(() => {
    setFormData(mailinglist ? mailinglist : initialState);
  }, [mailinglist]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      mailinglist
        ? await updateMailingList({ id: mailinglist._id, ...formData }).unwrap()
        : await postMailingList(formData).unwrap();

      toast.success(
        `MailingList ${mailinglist ? "updated" : "created"}  successfully`,
      );
      setFormData(initialState);

      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Modal
      modalTitle={`${mailinglist ? "Edit" : "New"} Mailing List`}
      isOpen={isOpen}
      modalDescription="Make changes to the mailing list here. Click save when you're done."
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <Input
          id="email"
          label="Email"
          value={formData.email}
          onChange={(e) => handleChange(e)}
        />

        <div className="space-y-1">
          <Label id={"tag"}>Tag</Label>
          <Select
            id={"tag"}
            value={formData.tag}
            onChange={handleChange}
            options={[
              { key: "careers", value: "careers", label: "Careers" },
              { key: "contactus", value: "contactus", label: "Contactus" },
              { key: "quote", value: "quote", label: "Quote" },
            ]}
          />
        </div>

        <ButtonGroup negativeClick={onClose} />
      </form>
    </Modal>
  );
};

export default MailingListDeptForm;
