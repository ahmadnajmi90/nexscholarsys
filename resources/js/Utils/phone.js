import { parsePhoneNumberFromString } from "libphonenumber-js";

export const DEFAULT_PHONE_COUNTRY = "MY";

const sanitizeRawInput = (value) => {
  if (!value) return "";
  const trimmed = String(value).trim();
  if (!trimmed) return "";

  let sanitized = trimmed
    .replace(/\u00a0/g, " ")
    .replace(/[()\-\s]/g, "")
    .replace(/\./g, "");

  if (sanitized.startsWith("00")) {
    sanitized = `+${sanitized.slice(2)}`;
  }

  return sanitized;
};

export const normalizePhoneNumber = (value, defaultCountry = DEFAULT_PHONE_COUNTRY) => {
  if (!value) return "";

  const sanitized = sanitizeRawInput(value);

  const candidates = [];

  if (sanitized) {
    candidates.push(sanitized);
    if (!sanitized.startsWith("+")) {
      candidates.push(`+${sanitized}`);
    }
  }

  candidates.push(String(value).trim());

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const parsed = parsePhoneNumberFromString(candidate, defaultCountry);
      if (parsed?.isValid()) {
        return parsed.number; // E.164 format
      }
    } catch (error) {
      // ignore and try next candidate
    }
  }

  return String(value).trim();
};

export const getDefaultCountryFromNumber = (value, fallback = DEFAULT_PHONE_COUNTRY) => {
  if (!value) return fallback;
  try {
    const parsed = parsePhoneNumberFromString(value);
    return parsed?.country || fallback;
  } catch (error) {
    return fallback;
  }
};


