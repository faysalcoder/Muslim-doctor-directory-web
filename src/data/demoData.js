// ============================================================
// Static site config — NOT doctor data.
// specialties / locations are fallback-only; the app fetches
// real values from /doctors/filters.php at runtime.
// contactInfo is site-level config that doesn't come from the DB.
// ============================================================

export const specialties = [
  "Cardiology",
  "Pediatrics",
  "Neurology",
  "General Practice",
  "Orthopedics",
  "Obstetrics & Gynecology",
  "Dermatology",
  "Psychiatry",
  "Ophthalmology",
  "ENT",
];

export const locations = [
  "Dhaka, Bangladesh",
  "Chittagong, Bangladesh",
  "Sylhet, Bangladesh",
  "Rajshahi, Bangladesh",
  "Indianapolis, USA",
  "New York, USA",
  "London, UK",
];

export const contactInfo = {
  address: "8075 N Shadeland Avenue, Ste 200, Indianapolis, IN 46250",
  phone: "+1 (317) 621-8500",
  email: "contact@nmp.org",
  hours: "Monday – Friday: 9:00 AM – 5:00 PM EST",
  socialLinks: {
    facebook: "#",
    instagram: "#",
    whatsapp: "#",
  },
};
