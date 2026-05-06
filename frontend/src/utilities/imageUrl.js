// utilities/imageUrl.js
export const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("data:")) return url; // already a full URL
  return `http://localhost:7000/uploads/${url}`; // relative path
};