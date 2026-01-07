import React, { useState, useEffect } from "react";
import {
  Input,
  ImageUpload,
  ButtonGroup,
  TextEditor,
  Modal,
} from "..";
import { toast } from "sonner";
import {
  usePostRegionMutation,
  useUpdateRegionMutation,
} from "@/redux/api/region";

const RegionForm = ({ onClose, region, isOpen }) => {
  const initialState = {
    name: { en: "", ar: "" },
    href: "",
    slider: [{ image: "", heading: { en: "", ar: "" } }],
    description: { en: "", ar: "" },
    seo: {
      title: "",
      metaDescription: "",
      metaKeywords: "",
      ogImage: "",
      ogUrl: "",
      canonicalUrl: "",
    },
  };

  const [formData, setFormData] = useState(initialState);
  const [postRegion] = usePostRegionMutation();
  const [updateRegion] = useUpdateRegionMutation();

  useEffect(() => {
    if (region) {
      setFormData({
        ...initialState,
        ...region,
        name: region.name || initialState.name,
        description: region.description || initialState.description,
        slider: Array.isArray(region.slider) && region.slider.length > 0
          ? region.slider
          : initialState.slider,
        seo: region.seo || initialState.seo,
      });
    } else {
      setFormData(initialState);
    }
  }, [region, isOpen]);

  const handleNestedChange = (field, lang, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };


  const handleSliderChange = (index, field, lang, value) => {
    setFormData((prev) => ({
      ...prev,
      slider: prev.slider.map((slide, i) => {
        if (i !== index) return slide;

        if (lang) {
          return {
            ...slide,
            [field]: {
              ...slide[field],
              [lang]: value,
            },
          };
        }

        return {
          ...slide,
          [field]: value,
        };
      }),
    }));
  };

  const addSlide = () => {
    setFormData((prev) => ({
      ...prev,
      slider: [...prev.slider, { image: "", heading: { en: "", ar: "" } }],
    }));
  };

  const removeSlide = (index) => {
    setFormData((prev) => ({
      ...prev,
      slider: prev.slider.filter((_, i) => i !== index),
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (region) {
        await updateRegion({ id: region._id, ...formData }).unwrap();
      } else {
        await postRegion(formData).unwrap();
      }
      toast.success(`Region ${region ? "updated" : "created"} successfully`);
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalTitle={`${region ? "Edit" : "New"} Region`}
      modalDescription="Make changes to the region here. Click save when you're done."
    >
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Name (EN)"
            value={formData.name.en}
            onChange={(e) => handleNestedChange("name", "en", e.target.value)}
          />
          <Input
            label="Name (AR)"
            value={formData.name.ar}
            onChange={(e) => handleNestedChange("name", "ar", e.target.value)}
          />
        </div>

        <Input
          id="href"
          label="Slug / Href"
          value={formData.href}
          onChange={handleChange}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider">Slider Images</h3>
            <button
              type="button"
              onClick={addSlide}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              + Add Slide
            </button>
          </div>

          {formData.slider.map((slide, index) => (
            <div key={index} className="relative space-y-3 rounded-lg border bg-gray-50/50 p-4">
              {formData.slider.length > 1 && (
                <button
                  type="button"
                  className="absolute right-3 top-3 text-xs text-red-500 hover:text-red-700"
                  onClick={() => removeSlide(index)}
                >
                  Remove
                </button>
              )}

              <ImageUpload
                uploadUrl="/uploads/regions"
                title={`Slide Image ${index + 1}`}
                imageUrl={slide.image}
                onUploadSuccess={(filePath) =>
                  handleSliderChange(index, "image", null, filePath)
                }
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Heading (EN)"
                  value={slide.heading.en}
                  onChange={(e) => handleSliderChange(index, "heading", "en", e.target.value)}
                />
                <Input
                  label="Heading (AR)"
                  value={slide.heading.ar}
                  onChange={(e) => handleSliderChange(index, "heading", "ar", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 pt-4">
          <TextEditor
            label="Description (EN)"
            value={formData.description.en}
            onChange={(val) => handleNestedChange("description", "en", val)}
          />
          <TextEditor
            label="Description (AR)"
            value={formData.description.ar}
            onChange={(val) => handleNestedChange("description", "ar", val)}
          />
        </div>

        <div className="pt-6">
          <ButtonGroup
            positiveLabel={region ? "Update Region" : "Create Region"}
            positiveType="submit"
            negativeClick={onClose}
          />
        </div>
      </form>
    </Modal>
  );
};

export default RegionForm;