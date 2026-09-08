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

export function sendMessage(messageData) {
  return apiClient.post("/content/messages", messageData);
}

export function getMessages() {
  return apiClient.get("/content/messages");
}
