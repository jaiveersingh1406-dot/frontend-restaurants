import { apiClient } from "./client";

export function getReviews() {
  return apiClient.get("/content/reviews");
}

export function getChefs() {
  return apiClient.get("/content/chefs");
}

export function getGallery() {
  return apiClient.get("/content/gallery");
}
