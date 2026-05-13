// utilities/imageUrl.js
export const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("data:")) return url; // already a full URL
  return `${import.meta.env.VITE_BACKEND_URL}/uploads/${url}`; // relative path
};