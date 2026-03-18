
import React, { useState, useEffect } from "react";
import { usePostUploadMutation } from "@/redux/api/upload";
import { toast } from "sonner";
import { Input, Button, Label } from "..";
import { cn } from "@/utils/cn";
import imageCompression from "browser-image-compression";

const ImageUpload = ({
  uploadUrl = "/uploads",
  title = "image",
  imageUrl,
  label = "Image",
  onUploadSuccess,
  className,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [upload] = usePostUploadMutation();

  const MAX_FILE_SIZE = 25 * 1024 * 1024;

  useEffect(() => {
    if (imageUrl) {
      setPreviewUrl(`${import.meta.env.VITE_API_BASE_URL}${imageUrl}`);
    }
  }, [imageUrl]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;


    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be below 25 MB");
      e.target.value = "";
      return;
    }

    try {
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp",
      };

      const compressedFile = await imageCompression(file, options);

      setSelectedImage(compressedFile);
      setPreviewUrl(URL.createObjectURL(compressedFile));
    } catch (error) {
      toast.error("Image compression failed");
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image to upload.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await upload({
        image: formData,
        folder: uploadUrl,
        title,
      }).unwrap();

      if (response.success) {
        toast.success("Image uploaded successfully!");
        setSelectedImage(null);
        setPreviewUrl("");
        onUploadSuccess?.(response.filePath);
      } else {
        toast.error(response.message || "Failed to upload image.");
      }
    } catch (error) {
      toast.error("An error occurred while uploading the image.");
    } finally {
      setIsUploading(false);
    }
  };

  const defaultClass = cn("object-contain w-full h-[20rem]", className);

  return (
    <div className="image-upload-component">
      <Label>{label}</Label>

      <Input type="file" accept="image/*" onChange={handleFileChange} />

      {previewUrl && (
        <div className="image-preview">
          <img src={previewUrl} alt="Preview" className={defaultClass} />
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!selectedImage || isUploading}
        size="sm"
        className="mt-3"
      >
        {isUploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
};

export default ImageUpload;
