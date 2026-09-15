import { apiClient } from "./client";

export const listUsers = () => apiClient.get("/api/users");
export const createUser = (payload) => apiClient.post("/api/users", payload);
export const updateDistrict = (id, district) =>
  apiClient.patch(
    `/api/users/${id}/district?district=${encodeURIComponent(district)}`,
  );

export const usersApi = { listUsers, createUser, updateDistrict };
