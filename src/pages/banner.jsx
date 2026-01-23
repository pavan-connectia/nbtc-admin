import React, { useState } from "react";
import { Heading, Card, Button, Text, ImageUpload } from "@/components";
import {
    useGetBannerImagesQuery,
    useUpdateBannerImagesMutation,
} from "@/redux/api/banner";
import { LuSave } from "react-icons/lu";
import { toast } from "sonner";

const SECTIONS = [
    { key: "csr", label: "CSR Banner" },
    { key: "gallery", label: "Gallery Banner" },
    { key: "news", label: "News Banner" },
    { key: "publication", label: "Publication Banner" },
    { key: "video", label: "Video Banner" },

    { key: "qualification", label: "Qualification Banner" },

    { key: "subsidiaries", label: "Subsidiaries Banner" },

    { key: "qhse", label: "QHSE Banner" },

    { key: "career", label: "Career Banner" },

    { key: "project", label: "Project Banner" },

    { key: "executiveManagement", label: "Executive Management Banner" },
    { key: "mdMsg", label: "MD Message Banner" },
    { key: "chairmanMsg", label: "Chairman Message Banner" },
    { key: "vision", label: "Vision Banner" },
    { key: "corporateProfile", label: "Corporate Profile Banner" },
];


const Banner = () => {
    const { data, isLoading } = useGetBannerImagesQuery();
    const [updateBannerImages, { isLoading: saving }] =
        useUpdateBannerImagesMutation();

    // store unsaved uploads
    const [pendingImages, setPendingImages] = useState({});

    const handleSave = async () => {
        if (Object.keys(pendingImages).length === 0) return;

        const payload = {};
        Object.keys(pendingImages).forEach((key) => {
            payload[key] = { image: pendingImages[key] };
        });

        try {
            await updateBannerImages(payload).unwrap();
            toast.success("Banner images saved successfully");
            setPendingImages({});
        } catch (error) {
            toast.error(error?.data?.message || "Failed to save banner images");
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Heading>Landing Page Images</Heading>


                <Button
                    onClick={handleSave}
                    disabled={saving || Object.keys(pendingImages).length === 0}
                >
                    <LuSave />
                    Save Changes
                </Button>
            </div>

            {isLoading ? (
                <Text>Loading banners...</Text>
            ) : (
                <Card className="p-5 space-y-6">
                    <Text>
                        Make changes to the Banner page here. Click save when you're done.
                    </Text>
                    {SECTIONS.map((section) => {
                        const previewImage =
                            pendingImages[section.key] ||
                            data?.data?.[section.key]?.image ||
                            "";

                        return (
                            <div
                                key={section.key}
                                className="p-4 border rounded-lg space-y-3"
                            >
                                <Text className="font-medium">{section.label}</Text>

                                <ImageUpload
                                    imageUrl={previewImage}
                                    uploadUrl={"/uploads/banner"}
                                    title={section.label}
                                    onUploadSuccess={(filePath) =>
                                        setPendingImages((prev) => ({
                                            ...prev,
                                            [section.key]: filePath,
                                        }))
                                    }
                                />

                            </div>
                        );
                    })}
                </Card>
            )}
        </div>
    );
};

export default Banner;
