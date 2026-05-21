import { BASE_URL } from "./axios";

export function doctorImageUrl(filename) {
  if (!filename) return null;
  if (filename.startsWith("http://") || filename.startsWith("https://") || filename.startsWith("/")) return filename;
  return `${BASE_URL}/uploads/doctors/${filename}`;
}

export function galleryImageUrl(filename) {
  if (!filename) return null;
  if (filename.startsWith("http://") || filename.startsWith("https://") || filename.startsWith("/")) return filename;
  return `${BASE_URL}/uploads/doctors/gallery/${filename}`;
}
