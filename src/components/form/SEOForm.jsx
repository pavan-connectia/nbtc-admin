import React from "react";
import { Heading, Input, Text } from "..";

const SEOForm = ({ seo = {}, onChange }) => {
  const {
    title = "",
    metaDescription = "",
    metaKeywords = "",
    ogImage = "",
    ogUrl = "",
    canonicalUrl = "",
  } = seo;

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const updatedSeo = { ...seo, [id]: value };
    onChange(updatedSeo);
  };

  return (
    <div className="pt-10 space-y-4">
      <Heading className="text-xl">SEO</Heading>
      <Text>
        Optimize your content for search engines and social media by adding
        relevant titles, descriptions, and metadata. This helps improve
        visibility, engagement, and sharing of your page.
      </Text>
      <Input
        id="title"
        label="SEO Title"
        placeholder="This is the title shown in search engine results."
        value={title}
        onChange={handleInputChange}
      />
      <Input
        id="metaDescription"
        label="Meta Description"
        placeholder="A short description of the page for search engines."
        value={metaDescription}
        onChange={handleInputChange}
      />
      <Input
        id="metaKeywords"
        label="Meta Keywords"
        placeholder="Keywords describing the page (comma-separated)."
        value={metaKeywords}
        onChange={handleInputChange}
      />
      <Input
        id="ogImage"
        label="Open Graph Image URL"
        placeholder="URL of the image displayed when shared on social media."
        value={ogImage}
        onChange={handleInputChange}
      />
      <Input
        id="ogUrl"
        label="Open Graph URL"
        placeholder="URL of the page for social media sharing."
        value={ogUrl}
        onChange={handleInputChange}
      />
      <Input
        id="canonicalUrl"
        label="Canonical URL"
        placeholder="The preferred URL for this page to avoid duplication."
        value={canonicalUrl}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SEOForm;
