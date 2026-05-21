// src/api/axios.js
// ---------------------------------------------------------------------------
// Pure API layer — no demo data, no in-memory fallbacks.
// Every function throws on failure so callers can show proper error states.
// Set REACT_APP_API_URL in .env:
//   REACT_APP_API_URL=https://nompus.com/api
// ---------------------------------------------------------------------------

const DEFAULT_BASE_URL = "https://nompus.com/api";
// const DEFAULT_BASE_URL = "http://localhost/nopm-api";

function getBaseUrl() {
  if (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace(/\/$/, "");
  }
  return DEFAULT_BASE_URL;
}

export const BASE_URL = getBaseUrl();

// ── Image URL helpers ──────────────────────────────────────────────────────
export function resolveImageUrl(filename) {
  if (!filename) return null;
  if (
    filename.startsWith("http://") ||
    filename.startsWith("https://") ||
    filename.startsWith("/")
  ) {
    return filename;
  }
  return `${BASE_URL}/uploads/doctors/${filename}`;
}

export function resolveGalleryImageUrl(filename) {
  if (!filename) return null;
  if (
    filename.startsWith("http://") ||
    filename.startsWith("https://") ||
    filename.startsWith("/")
  ) {
    return filename;
  }
  return `${BASE_URL}/uploads/doctors/gallery/${filename}`;
}

// ── Low-level fetch helper — throws on network error or non-JSON ───────────
async function request(
  path,
  { method = "GET", body = null, isFormData = false } = {},
) {
  const token = localStorage.getItem("token");
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isFormData && body !== null)
    headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body === null ? undefined : isFormData ? body : JSON.stringify(body),
  });

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    throw new Error(`Unexpected response from server (HTTP ${res.status})`);
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || `Server error (HTTP ${res.status})`);
  }

  return data;
}

// ── Auth ───────────────────────────────────────────────────────────────────
export async function loginAdmin(email, password) {
  return request("/auth/login.php", {
    method: "POST",
    body: { email, password },
  });
}

// ── Dashboard ──────────────────────────────────────────────────────────────
export async function getDashboardStats() {
  return request("/dashboard/stats.php");
}

// ── Filter options (specialties + locations from real DB data) ─────────────
export async function getFilterOptions() {
  return request("/doctors/filters.php");
}

// ── Normalise a raw API doctor record for component consumption ────────────
function normaliseApiDoctor(d) {
  return {
    ...d,
    profile_image: resolveImageUrl(d.profile_image),
    image: resolveImageUrl(d.profile_image), // alias for DoctorCard
    about: d.bio,
    acceptingPatients:
      d.accepting_patients === 1 || d.accepting_patients === "1",
    // Ensure extended fields are always present (may be null from old rows)
    academic_title: d.academic_title || d.academicTitle || "",
    academic_affiliation: d.academic_affiliation || d.academicAffiliation || "",
    medical_school_affiliation: d.medical_school_affiliation || d.medicalSchoolAffiliation || "",
    medical_school_attended: d.medical_school_attended || d.medical_school_affiliation || d.medicalSchoolAttended || "",
    subspecialty: d.subspecialty || "",
    graduation_degree: d.graduation_degree || d.degree || "",
    degree: d.degree || d.graduation_degree || "",
    graduation_year: d.graduation_year || d.year_graduated || "",
    year_graduated: d.year_graduated || d.graduation_year || "",
    hospital_affiliations: d.hospital_affiliations || "",
    awards: d.awards || "",
    languages:
      typeof d.languages === "string"
        ? d.languages
            .split(",")
            .map((l) => l.trim())
            .filter(Boolean)
        : d.languages || [],
    gallery: (d.gallery || []).map((g) => ({
      ...g,
      image: resolveGalleryImageUrl(g.image),
    })),
  };
}

// ── Public: verified doctors for homepage / search ─────────────────────────
export async function getPublicDoctors(params = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(
      Object.entries({ ...params, status: "verified" }).filter(
        ([, v]) => v !== "" && v !== undefined,
      ),
    ),
  ).toString();
  const data = await request("/doctors/all.php" + (qs ? `?${qs}` : ""));
  return {
    success: true,
    data: (data.data || []).map(normaliseApiDoctor),
    pagination: data.pagination || {},
  };
}

// ── Admin: all doctors (any status) ───────────────────────────────────────
export async function getDoctors(params = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== "" && v !== undefined),
    ),
  ).toString();
  const data = await request("/doctors/all.php" + (qs ? `?${qs}` : ""));
  return {
    success: true,
    data: (data.data || []).map(normaliseApiDoctor),
    pagination: data.pagination || {},
  };
}

// ── Single doctor by ID ────────────────────────────────────────────────────
export async function getDoctorById(id) {
  const data = await request(
    `/doctors/single.php?id=${encodeURIComponent(id)}`,
  );
  return {
    success: true,
    data: normaliseApiDoctor(data.data),
  };
}

// ── Create doctor (admin) ─────────────────────────────────────────────────
export async function createDoctor(formData) {
  return request("/doctors/create.php", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

// ── Update doctor (admin) ─────────────────────────────────────────────────
export async function updateDoctor(formData) {
  return request("/doctors/update.php", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

// ── Delete doctor ─────────────────────────────────────────────────────────
export async function deleteDoctor(id) {
  return request("/doctors/delete.php", {
    method: "POST",
    body: { id },
  });
}

// ── Toggle doctor status ──────────────────────────────────────────────────
export async function toggleDoctorStatus(id, status) {
  return request("/doctors/toggle-status.php", {
    method: "POST",
    body: { id, status },
  });
}

// ── Upload gallery images ─────────────────────────────────────────────────
export async function uploadDoctorImages(doctorId, files) {
  const formData = new FormData();
  formData.append("doctor_id", doctorId);
  files.forEach((file) => formData.append("images[]", file));
  return request("/doctors/upload-gallery.php", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

// ── Remove a gallery image ────────────────────────────────────────────────
export async function removeDoctorImage(imageId) {
  return request("/doctors/remove-image.php", {
    method: "POST",
    body: { id: imageId },
  });
}

// ── Session helpers ───────────────────────────────────────────────────────
export function saveSession(user, token) {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
}

export function clearSession() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
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

// ── Settings ──────────────────────────────────────────────────────────────
export async function getSettings() {
  return request("/settings/get.php");
}

export async function updateSettings(siteName, adminEmail) {
  return request("/settings/update.php", {
    method: "POST",
    body: { site_name: siteName, admin_email: adminEmail },
  });
}

export async function changePassword(
  currentPassword,
  newPassword,
  confirmPassword,
) {
  return request("/settings/change-password.php", {
    method: "POST",
    body: {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    },
  });
}
