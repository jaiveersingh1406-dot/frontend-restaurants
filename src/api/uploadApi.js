import { API_BASE_URL } from "../config/constants";

export async function uploadImage(file) {
  if (!file) {
    throw new Error("No file selected");
  }

  const formData = new FormData();
  formData.append("file", file);

  let response;

  try {
    response = await fetch(`${API_BASE_URL}/content/upload`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error("Cannot connect to the server. Please check the backend.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      typeof data?.detail === "string"
        ? data.detail
        : "Image upload failed. Please try again."
    );
  }

  return data;
}
