export type LoginBody = {
  email: string;
  password: string;
};

export type RegisterBody = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  token: string;
  refreshToken: string;
};
