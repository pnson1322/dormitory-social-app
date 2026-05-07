export type UserRole = "admin" | "manager" | "seniormanager" | "student";
export type UserStatus = "active" | "locked";

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

export type CreateUserBody = {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
};
