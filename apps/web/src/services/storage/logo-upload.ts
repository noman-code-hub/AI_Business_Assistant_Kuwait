/**
 * Local logo handling for Phase 3 onboarding (no Firebase Storage required).
 *
 * Flow:
 *   File → resized data URL (base64) → stored in onboarding draft (localStorage)
 *                                    → sent as `logoUrl` when creating the business
 *
 * Notes:
 * - This avoids Firebase Storage rules/network delays during onboarding.
 * - Data URLs are fine for small logos; we resize to keep size reasonable.
 * - Firebase Storage upload remains available later if you publish storage.rules.
 */
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_EDGE_PX = 512;
const JPEG_QUALITY = 0.82;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not read image file"));
    };
    reader.onerror = () => reject(new Error("Could not read image file"));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Invalid image file"));
    img.src = dataUrl;
  });
}

/** Resize large images so localStorage / Firestore logoUrl stays small. */
async function resizeToDataUrl(file: File): Promise<string> {
  const raw = await readFileAsDataUrl(file);
  const img = await loadImage(raw);
  const scale = Math.min(1, MAX_EDGE_PX / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return raw;
  ctx.drawImage(img, 0, 0, width, height);

  // Prefer JPEG for smaller localStorage footprint (except keep PNG if source is PNG with transparency needs — JPEG is OK for logos)
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

/**
 * Prepare a logo for onboarding: validate + resize → data URL for local draft / logoUrl.
 */
export async function prepareLocalLogo(file: File): Promise<string> {
  if (!ALLOWED.has(file.type)) {
    throw new Error("Logo must be JPEG, PNG, or WebP");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Logo must be 2MB or smaller");
  }
  return resizeToDataUrl(file);
}

/** @deprecated Prefer prepareLocalLogo (localStorage). Kept for optional Storage later. */
export async function uploadBusinessLogo(userId: string, file: File): Promise<string> {
  void userId;
  return prepareLocalLogo(file);
}
