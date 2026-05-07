import { http } from "@/services/http";
import { ApiResponse } from "@/services/base.types";
import { LoginBody, LoginPayload, RegisterBody } from "./auth.types";

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
