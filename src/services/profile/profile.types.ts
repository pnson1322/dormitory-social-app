export type Gender = "Male" | "Female" | "Other";

export type ProfileData = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  gender: Gender | null;
  dateOfBirth: string | null; // YYYY-MM-DD
  bio: string | null;
  avatarUrl: string | null;

  studentCode: string | null;
  studentYear: string | null;
  school: string | null;
  faculty: string | null;

  citizenId: string | null;
  citizenIdIssuedPlace: string | null;
  ethnicity: string | null;
  religion: string | null;

  province: string | null;
  district: string | null;
  ward: string | null;
  addressLine: string | null;

  emergencyContactName: string | null;
  emergencyContactPhoneNumber: string | null;
  emergencyContactAddress: string | null;

  room: {
    id: string;
    name: string;
    building: string;
  } | null;
};

export type UpdateProfileBody = {
  fullName: string;
  phoneNumber?: string | null;
  gender?: Gender | null;
  dateOfBirth?: string | null;
  bio?: string | null;
  studentCode?: string | null;

  studentYear?: string | null;
  school?: string | null;
  faculty?: string | null;

  citizenId?: string | null;
  citizenIdIssuedPlace?: string | null;
  ethnicity?: string | null;
  religion?: string | null;

  province?: string | null;
  district?: string | null;
  ward?: string | null;
  addressLine?: string | null;

  emergencyContactName?: string | null;
  emergencyContactPhoneNumber?: string | null;
  emergencyContactAddress?: string | null;
};

export type UploadAvatarResponse = {
  avatarUrl: string;
};
