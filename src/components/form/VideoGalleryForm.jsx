import React, { useState, useEffect } from "react";
import { Modal, Input, Index, Display, ButtonGroup, Text, Button } from "..";
import {
  usePostVideoGalleryMutation,
  useUpdateVideoGalleryMutation,
} from "@/redux/api/videGallery";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const VideoGalleryForm = ({ isOpen, onClose, videoGallery }) => {
  const { role, department } = useSelector((state) => state.auth);
  const initialState = {
    title: { en: "", ar: "" },
    video: "",
    display: true,
    index: 0,
    showInMain: role === "superadmin",
    requested: false,
    department: role !== "superadmin" ? department : undefined,
  };
  const [formData, setFormData] = useState(initialState);

  const [postVideoGallery] = usePostVideoGalleryMutation();
  const [updateVideoGallery] = useUpdateVideoGalleryMutation();

  useEffect(() => {
    setFormData(videoGallery ? videoGallery : initialState);
  }, [videoGallery]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const newValue = id === "display" ? value === "true" : value;
    setFormData((prev) => ({ ...prev, [id]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };

    if (department) {
      payload.department = department;
    }
    try {
      videoGallery
        ? await updateVideoGallery({
            id: videoGallery._id,
            ...payload,
          }).unwrap()
        : await postVideoGallery(payload).unwrap();

      toast.success(
        `Video gallery ${videoGallery ? "updated" : "created"} successfully`,
      );
      setFormData(initialState);

      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleRequest = async () => {
    try {
      await updateVideoGallery({
        id: videoGallery._id,
        department,
        requested: true,
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
      modalTitle={`${videoGallery ? "Edit" : "New"} Video Gallery`}
      modalDescription="Make changes to the Video gallery here. Click save when you're done."
      onClose={onClose}
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <Input
          id="title"
          label="Title (EN)"
          value={formData.title.en}
          onChange={(e) =>
            setFormData({
              ...formData,
              title: { ...formData.title, en: e.target.value },
            })
          }
        />

        <Input
          id="title"
          label="Title (AR)"
          value={formData.title.ar}
          onChange={(e) =>
            setFormData({
              ...formData,
              title: { ...formData.title, ar: e.target.value },
            })
          }
        />

        <Input
          id="video"
          label="Video Link"
          value={formData.video}
          onChange={handleChange}
        />

        <Display
          value={formData.display}
         onChange={(val) => setFormData((prev) => ({ ...prev, display: val }))}
        />

        {role === "superadmin" && (
          <Display
            id="showInMain"
            label="Show in Main"
            value={formData.showInMain}
            onChange={(val) => setFormData((prev) => ({ ...prev, showInMain: val }))}
          />
        )}

        <Index value={formData.index} onChange={handleChange} />

        {role !== "superadmin" &&
          (formData.showInMain ? (
            <Text className="text-center">
              Already featured on Main Website
            </Text>
          ) : formData.requested ? (
            <Text className="text-center">
              Request already sent to featured on Main Website
            </Text>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleRequest}
            >
              Request to featured on Main Website
            </Button>
          ))}

        <ButtonGroup negativeClick={onClose} />
      </form>
    </Modal>
  );
};

export default VideoGalleryForm;
