import { http } from "@/services/http";

export type LoginBody = { email: string; password: string };

export type RegisterBody = {
  fullName: string;
  email: string;
  password: string;
};

type ApiResponse<T> = { data: T; meta: any };

export type LoginPayload = {
  token: string;
  refreshToken: string;
};

export async function loginApi(body: LoginBody) {
  const { data } = await http.post<ApiResponse<LoginPayload>>(
    "/api/auth/login",
    body,
  );
  return data.data;
}

export async function registerApi(body: RegisterBody) {
  await http.post("/api/auth/register", body);
}
