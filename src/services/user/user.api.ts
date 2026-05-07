import { http } from "@/services/http";
import { ApiResponse } from "@/services/base.types";
import {
  CreateUserBody,
  GetUsersParams,
  UserDetail,
  UserItem,
  UserSummaryItem,
  UserRole,
  UserStatus,
} from "./user.types";

export async function getUsers(params?: GetUsersParams) {
  const { data } = await http.get<ApiResponse<UserItem[]>>("/api/auth/users", {
    params,
  });

  return {
    items: data.data,
    meta: data.meta,
  };
}

export async function getUserById(id: string) {
  const { data } = await http.get<{ data: UserDetail }>(
    `/api/auth/users/${id}`,
  );
  return data.data;
}

export async function getUserSummary() {
  const { data } = await http.get<{ data: UserSummaryItem[] }>(
    "/api/auth/users/summary",
  );
  return data.data;
}

export async function updateUserRole(id: string, role: UserRole) {
  await http.put(`/api/auth/users/${id}/role`, { role });
}

export async function updateUserStatus(id: string, status: UserStatus) {
  await http.put(`/api/auth/users/${id}/status`, { status });
}

export async function createUser(body: CreateUserBody) {
  await http.post("/api/auth/users", body);
}
