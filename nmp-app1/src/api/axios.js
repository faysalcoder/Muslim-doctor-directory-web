// src/api.js
const DEFAULT_BASE_URL = "http://localhost/nopm-api";

function getBaseUrl() {
  // CRA
  if (
    typeof process !== "undefined" &&
    process.env &&
    process.env.REACT_APP_API_URL
  ) {
    return process.env.REACT_APP_API_URL.replace(/\/$/, "");
  }

  // Vite
  if (
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL
  ) {
    return String(import.meta.env.VITE_API_URL).replace(/\/$/, "");
  }

  return DEFAULT_BASE_URL;
}

export const BASE_URL = getBaseUrl();

async function request(
  path,
  { method = "GET", body = null, isFormData = false, extraHeaders = {} } = {},
) {
  const token = localStorage.getItem("token");

  const headers = {
    ...extraHeaders,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Only set JSON content type when body is plain JSON
  if (!isFormData && body !== null) {
    headers["Content-Type"] = "application/json";
  }

  const options = {
    method,
    headers,
  };

  if (body !== null) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, options);

  let data;
  const contentType = res.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = {
        success: false,
        message: text || "Invalid server response",
      };
    }
  } catch {
    data = {
      success: false,
      message: "Invalid server response",
    };
  }

  if (!res.ok && !data?.message) {
    data.message = `Request failed (${res.status})`;
  }

  return data;
}

export async function loginAdmin(email, password) {
  return request("/auth/login.php", {
    method: "POST",
    body: { email, password },
  });
}

export async function getDashboardStats() {
  return request("/dashboard/stats.php");
}

export async function getDoctors() {
  return request("/doctors/all.php");
}

export async function getDoctorById(id) {
  return request(`/doctors/single.php?id=${encodeURIComponent(id)}`);
}

export async function createDoctor(formData) {
  return request("/doctors/create.php", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

export async function updateDoctor(formData) {
  return request("/doctors/update.php", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

export async function deleteDoctor(id) {
  return request("/doctors/delete.php", {
    method: "POST",
    body: { id },
  });
}

export async function uploadDoctorImages(doctorId, files) {
  const formData = new FormData();
  formData.append("doctor_id", doctorId);

  files.forEach((file) => {
    formData.append("images[]", file);
  });

  return request("/doctors/upload-gallery.php", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

export async function removeDoctorImage(imageId) {
  return request("/doctors/remove-image.php", {
    method: "POST",
    body: { id: imageId },
  });
}

export function saveSession(user, token) {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
}

export function clearSession() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

export function getStoredUser() {
  const raw = localStorage.getItem("user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getStoredToken() {
  return localStorage.getItem("token");
}

export function isLoggedIn() {
  return Boolean(getStoredToken());
}
