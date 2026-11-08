import { translations } from "./translations.js";

const DEFAULT_LANGUAGE = "mn";

export function getCurrentLanguage() {
  return localStorage.getItem("language") || DEFAULT_LANGUAGE;
}

export function setLanguage(language) {
  localStorage.setItem("language", language);
}

export function t(path) {
  const language = getCurrentLanguage();
  const keys = path.split(".");
  let value = translations[language];
  for (const key of keys) {
    value = value?.[key];
  }
  return value ?? path;
}

export function toggleLanguage() {
  const current = getCurrentLanguage();
  const next = current === "mn" ? "en" : "mn";
  setLanguage(next);
  return next;
}

export function getLocalizedValue(value, fallback = "") {
  const language = getCurrentLanguage();
  if (value == null) return fallback;
  if (typeof value === "object" && !Array.isArray(value)) {
    if ("en" in value || "mn" in value) {
      return value[language] || value.en || value.mn || fallback;
    }
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, getLocalizedValue(val, fallback)]));
  }
  return value;
}

export function formatDate(dateString) {
  if (!dateString) return "";
  const language = getCurrentLanguage();
  let day, month, year;
  const parts = dateString.split(/[.-]/);
  if (parts.length !== 3) return dateString;

  if (parts[0].length === 4) {
    [year, month, day] = parts;
  } else if (parts[2].length === 4) {
    [day, month, year] = parts;
  } else {
    return dateString;
  }

  day = String(day).padStart(2, "0");
  month = String(month).padStart(2, "0");

  if (language === "mn") {
    return `${year}.${month}.${day}`;
  }
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
