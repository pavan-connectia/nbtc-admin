import React, { useState, useEffect } from "react";
import { Modal, Input, TextArea } from "..";

const QuotationForm = ({ isOpen, onClose, quotation }) => {
  const initialState = {
    name: "",
    email: "",
    phone: "",
    message: "",
    department: "",
    equipment: "",
  };
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    setFormData(quotation ? quotation : initialState);
  }, [quotation]);

  return (
    <Modal
      isOpen={isOpen}
      modalTitle={"View Quotation"}
      modalDescription="Make changes to the quotation here. Click save when you're done."
      onClose={onClose}
    >
      <div className="mt-5 space-y-4">
        <Input id="title" label="Name" value={formData.name} readOnly />
        <Input id="email" label="Email" value={formData.email} readOnly />
        <Input id="phone" label="Phone" value={formData.phone} readOnly />
        <TextArea
          id="message"
          label="Message"
          value={formData.message}
          readOnly
          rows={5}
        />
      </div>
    </Modal>
  );
};

export default QuotationForm;
