import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  ImageUpload,
  Index,
  Display,
  ButtonGroup,
  Text,
  Button,
} from "..";
import {
  usePostImgGalleryMutation,
  useUpdateImgGalleryMutation,
} from "@/redux/api/imgGallery";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const ImgGalleryForm = ({ isOpen, onClose, imgGallery }) => {
  const { department, role } = useSelector((state) => state.auth);
  const [postImgGallery] = usePostImgGalleryMutation();
  const [updateImgGallery] = useUpdateImgGalleryMutation();

  const initialState = {
    image: "",
    title: { en: "", ar: "" },
    display: true,
    showInMain: false,
    requested: false,
    index: 0,
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    setFormData(imgGallery ? imgGallery : initialState);
  }, [imgGallery]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const newValue =
      id === "display" || id === "showInMain" ? value === "true" : value;
    setFormData((prev) => ({ ...prev, [id]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };

    if (department) {
      payload.department = department;
    }
    try {
      imgGallery
        ? await updateImgGallery({ id: imgGallery._id, ...payload }).unwrap()
        : await postImgGallery(payload).unwrap();

      toast.success(
        `Image Gallery ${imgGallery ? "updated" : "saved"} successfully`,
      );

      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleRequest = async () => {
    try {
      await updateImgGallery({
        id: imgGallery._id,
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
      modalTitle={`${imgGallery ? "Edit" : "New"} Image Gallery`}
      modalDescription={
        "Make changes to the image gallery here. Click save when you're done."
      }
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

        <ImageUpload
          uploadUrl={"/uploads/gallery"}
          title={formData.title.en}
          imageUrl={formData?.image}
          onUploadSuccess={(filePath) =>
            setFormData({ ...formData, image: filePath })
          }
          className="h-[250px] w-full object-contain"
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

export default ImgGalleryForm;
