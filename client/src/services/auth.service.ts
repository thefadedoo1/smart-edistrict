import api from "./api";

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
  portal: "CITIZEN" | "OFFICER" | "ADMIN";
}

export const registerUser = async (
  data: RegisterPayload
) => {
  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
};

export const loginUser = async (
  data: LoginPayload
) => {
  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data;
};

export const forgotPassword = async (
  email: string
) => {
  const response = await api.post(
    "/auth/forgot-password",
    { email }
  );

  return response.data;
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const response = await api.post(
    "/auth/reset-password",
    { email, otp, newPassword }
  );

  return response.data;
};