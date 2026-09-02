import { apiClient } from "./client";

export function getProducts() {
  return apiClient.get("/products");
}

export function getProduct(id) {
  return apiClient.get(`/products/${id}`);
}

export function createProduct(productData) {
  return apiClient.post("/products", productData);
}

export function updateProduct(id, productData) {
  return apiClient.put(`/products/${id}`, productData);
}

export function deleteProduct(id) {
  return apiClient.delete(`/products/${id}`);
}
