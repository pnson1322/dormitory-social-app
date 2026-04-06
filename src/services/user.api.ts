import { http } from "@/services/http";

export type UserRole = "admin" | "manager" | "seniormanager" | "student";
export type UserStatus = "active" | "locked";

export type PagingMeta = {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

type ApiResponse<T> = {
  data: T;
  meta: PagingMeta | any;
};

export type UserItem = {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  role: UserRole;
  avatarUrl?: string | null;
};

export type UserDetail = {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  role: UserRole;
  avatarUrl: string | null;
  joinedAt: string;
  lastActiveAt: string;
};

export type UserSummaryItem = {
  roleName: UserRole;
  userCount: number;
};

export type GetUsersParams = {
  Search?: string;
  Role?: UserRole | "";
  Status?: UserStatus | "";
  Page?: number;
  PageSize?: number;
};

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

export async function createUser(body: {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}) {
  await http.post("/api/auth/users", body);
}
