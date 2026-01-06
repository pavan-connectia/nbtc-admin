import DOMPurify from "dompurify";
import { truncate } from "./truncate";

export const stripHtml = (html) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export const truncateHtml = (description, len) => {
  const sanitizedDescription = DOMPurify.sanitize(description);
  const plainTextDescription = stripHtml(sanitizedDescription);
  const truncatedDescription = truncate(plainTextDescription, len);
  return truncatedDescription;
};
