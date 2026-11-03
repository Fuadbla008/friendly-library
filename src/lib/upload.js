import { resizeImage } from "@/lib/utils";

export async function uploadCover(file) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Cover uploads are not set up yet. Add NEXT_PUBLIC_IMGBB_API_KEY to .env.local or paste an image URL."
    );
  }

  const dataUrl = await resizeImage(file, 900, 1350, 0.85);
  const form = new FormData();
  form.append("image", dataUrl.split(",")[1]);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
    { method: "POST", body: form }
  );
  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(
      payload?.error?.message || "The cover could not be uploaded. Try again."
    );
  }

  return payload.data.url;
}
