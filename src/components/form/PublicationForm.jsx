import React, { useState, useEffect } from "react";
import { Modal, Label,Text, Input, Button, ImageUpload, Index, Display } from "..";
import {
  usePostPublicationMutation,
  useUpdatePublicationMutation,
} from "@/redux/api/publication";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { usePostUploadFileMutation } from "@/redux/api/upload";
import { LuTrash } from "react-icons/lu";

const PublicationForm = ({ isOpen, onClose, publication, index }) => {
  const [upload] = usePostUploadFileMutation();
  const { role, department } = useSelector((state) => state.auth);
  const initialData = {
    image: "",
    title: "",
    department: role !== "superadmin" ? department : undefined,
    display: true,
    pdf: "",
    showInMain: role === "superadmin",
    requested: false,
    index: index,
    date: "",
  };
  const [formData, setFormData] = useState(initialData);

  const [postPublication] = usePostPublicationMutation();
  const [updatePublication] = useUpdatePublicationMutation();

  useEffect(() => {
    if (publication) {
      setFormData({
        title: publication.title || "",
        department: publication.department?._id || publication.department || undefined,
        image: publication.image || "",
        date: publication.date || "",
        pdf: publication.pdf || "",
        showInMain: publication.showInMain || false,
        display: publication.display !== undefined ? publication.display : true,
        index: publication.index || index,
      });
    } else {
      setFormData(initialData);
    }
  }, [publication, index]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const newValue = id === "display" ? value === "true" : value;
    setFormData((prev) => ({ ...prev, [id]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      publication
        ? await updatePublication({ id: publication._id, ...formData }).unwrap()
        : await postPublication(formData).unwrap();
      toast.success(
        `Publication ${publication ? "updated" : "created"} successfully`,
      );
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error saving publication:", error);
    }
  };

    const handleRequest = async () => {
    try {
      await updatePublication({
        id: publication._id,
        requested: true,
        department,
      }).unwrap();

      setFormData((prev) => ({ ...prev, requested: true }));
      toast.success("Request sent to admin");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      modalTitle={publication ? "Edit Publication" : "New Publication"}
      modalDescription={
        "Make changes to the publication here. Click save when you're done."
      }
      onClose={onClose}
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>

        <div className="space-y-1">
          <Label id="title">Title</Label>
          <Input id="title" value={formData.title} onChange={handleChange} />
        </div>

        <ImageUpload
          imageUrl={formData.image}
          uploadUrl="/uploads/news"
          title={formData.title}
          onUploadSuccess={(filePath) =>
            setFormData((prev) => ({ ...prev, image: filePath }))
          }
        />

        <Input
          id="date"
          label="Date"
          type="date"
          value={formData.date}
          onChange={handleChange}
        />

        <div className="space-y-1.5">
          <Label>Pdf</Label>

          {/* If PDF already exists, show preview */}
          {formData.pdf ? (
            <div className="flex items-center gap-3">
              <a
                href={import.meta.env.VITE_API_BASE_URL + formData.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {formData.pdf.split("/").pop()} {/* show only filename */}
              </a>
              <Button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, pdf: "" }))}
              >
                <LuTrash />
              </Button>
            </div>
          ) : (
            // Otherwise show file input
            <Input
              type="file"
              accept="application/pdf"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const formDataToUpload = new FormData();
                formDataToUpload.append("file", file);

                try {
                  const response = await upload({
                    image: formDataToUpload,
                    folder: "/uploads/pdf",
                  }).unwrap();
                  setFormData((prev) => ({ ...prev, pdf: response.filePath }));
                } catch (error) {
                  console.error("upload failed", error);
                }
              }}
            />
          )}
        </div>

        <Display value={formData.display} onChange={(val) => setFormData((prev) => ({ ...prev, display: val }))} />

        {role === "superadmin" && (
          <Display
            label="Show in Main"
            value={formData.showInMain}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, showInMain: val }))
            }
          />
        )}

                {role !== "superadmin" &&
                  (formData.showInMain ? (
                    <Text className="text-center">
                      Already featured on Main Website
                    </Text>
                  ) : formData.requested ? (
                    <Text className="text-center">
                      Request already sent to feature on Main Website
                    </Text>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleRequest}
                      type="button"
                    >
                      Request to feature on Main Website
                    </Button>
                  ))}

        <Index value={formData.index} onChange={handleChange} />

        <div className="flex flex-col w-full gap-3 pt-5 sm:flex-row">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Close
          </Button>
          <Button className="w-full" type="submit">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PublicationForm;
