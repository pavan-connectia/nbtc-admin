import React, { useState, useEffect } from "react";
import { usePostUploadMutation } from "@/redux/api/upload";
import { toast } from "sonner";
import { Input, Button, Label } from "..";
import { cn } from "@/utils/cn";

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

  const MAX_FILE_SIZE = 30 * 1024 * 1024;

  useEffect(() => {
    if (imageUrl) {
      setPreviewUrl(`${import.meta.env.VITE_API_BASE_URL}${imageUrl}`);
    }
  }, [imageUrl]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be below 30 MB");
      e.target.value = "";
      return;
    }

    try {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    } catch (error) {
      toast.error("Image Upload file");
    }
  };

  const cropImageBottomOnly = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; 
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const cropPx = 3.78;

        const sourceWidth = img.width;
        const sourceHeight = img.height;
        const targetWidth = sourceWidth;
        const targetHeight = sourceHeight - cropPx;

        if (targetHeight <= 0) {
          resolve(file); 
          return;
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        ctx.drawImage(
          img,
          0, 0, sourceWidth, targetHeight,
          0, 0, targetWidth, targetHeight   
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Canvas to Blob conversion failed"));
            return;
          }
          const croppedFile = new File([blob], file.name, { type: file.type });
          resolve(croppedFile);
        }, file.type);
      };
      img.onerror = (err) => {
        console.error("Image load error:", err);
        reject(err);
      };
    });
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image to upload.");
      return;
    }

    setIsUploading(true);

    try {
      const processedImage = await cropImageBottomOnly(selectedImage);

      const formData = new FormData();
      formData.append("image", processedImage);

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
      console.error(error);
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