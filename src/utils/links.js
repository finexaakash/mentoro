export const getSafeExternalUrl = (value) => {
  try {
    const url = new URL(String(value || "").trim());
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
};
