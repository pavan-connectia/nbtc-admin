import React, { useState, useEffect } from "react";
import { Modal, Input, Button, TextArea } from "..";

const CareerSubmissionForm = ({ isOpen, onClose, careerForm }) => {
  const [formData, setFormData] = useState(() => ({
    jobLocation: "",
    jobTitle: "",
    fName: "",
    mName: "",
    lName: "",
    nationality: "",
    age: null,
    gender: "",
    email: "",
    phone: "",
    location: "",
    experience: "",
    eduQualification: "",
    techQualification: "",
    remarks: "",
    resume: "",
  }));

  useEffect(() => {
    if (careerForm) {
      setFormData((prevState) => ({
        ...prevState,
        jobTitle: careerForm?.selectedOpening?.title?.en,
        jobLocation: careerForm?.selectedOpening?.location?.en,
        ...careerForm,
      }));
    }
  }, [careerForm]);

  return (
    <Modal
      isOpen={isOpen}
      modalTitle="Career Submission Details"
      modalDescription="Make changes to the career submission here. Click save when you're done."
      onClose={onClose}
    >
      <div className="mt-5 space-y-4">
        <Input label="Job Title" value={formData.jobTitle} readOnly />
        <Input label="Job Location" value={formData.jobLocation} readOnly />
        <Input label="First Name" value={formData.fName} readOnly />
        <Input label="Middle Name" value={formData.mName} readOnly />
        <Input label="Last Name" value={formData.lName} readOnly />
        <Input label="Nationality" value={formData.nationality} readOnly />
        <Input label="Age" value={formData.age} readOnly />
        <Input label="Gender" value={formData.gender} readOnly />
        <Input label="Email" value={formData.email} readOnly />
        <Input label="Phone No." value={formData.phone} readOnly />
        <Input label="Current Location" value={formData.location} readOnly />
        <Input label="Experience" value={formData.experience} readOnly />
        <Input
          label="Education Qualification"
          value={formData.eduQualification}
          readOnly
        />
        <Input
          label="Technical Qualification"
          value={formData.techQualification}
          readOnly
        />
        <TextArea label="Remarks" value={formData.remarks} readOnly />

        {formData.resume && (
          <a
            href={`${import.meta.env.VITE_API_BASE_URL}${formData.resume}`}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block"
          >
            <Button className="w-full">Download Resume</Button>
          </a>
        )}

        <Button variant="outline" className="w-full" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default CareerSubmissionForm;
