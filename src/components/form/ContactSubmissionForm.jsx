import React, { useState, useEffect } from "react";
import { Modal, Input, TextArea, ButtonGroup } from "..";

const ContactSubmissionForm = ({ isOpen, onClose, contactForm }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    subject: "",
    question: "",
  });

  useEffect(() => {
    setFormData(contactForm ? contactForm : formData);
  }, [contactForm]);

  return (
    <Modal
      isOpen={isOpen}
      modalTitle={"Contact Submission Details"}
      modalDescription="Make changes to the contact form here. Click save when you're done."
      onClose={onClose}
    >
      <div className="mt-5 space-y-4">
        <Input id="name" label="Name" value={formData.name} readOnly />

        <Input id="email" label="Email" value={formData.email} readOnly />

        <Input
          id="phoneNo"
          label="Phone No."
          value={formData.phoneNo}
          readOnly
        />

        <TextArea
          id="subject"
          label="Subject"
          value={formData.subject}
          rows={6}
          readOnly
        />

        <TextArea
          id="question"
          label="Question"
          value={formData.question}
          readOnly
        />

        <ButtonGroup negativeClick={onClose} />
      </div>
    </Modal>
  );
};

export default ContactSubmissionForm;
