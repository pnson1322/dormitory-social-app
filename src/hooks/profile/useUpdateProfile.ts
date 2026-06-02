import { getApiErrorMessage } from "@/services/apiError";
import { getMyProfile, updateMyProfile, uploadMyAvatar } from "@/services/profile/profile.api";
import { Gender, ProfileData } from "@/services/profile/profile.types";
import { useMemo, useState } from "react";

function isValidPhoneNumber(phone: string) {
  const cleaned = phone.replace(/\s+/g, "");
  return /^[0-9+()-]{8,15}$/.test(cleaned);
}

type TouchedState = {
  fullName: boolean;
  phoneNumber: boolean;
  gender: boolean;
  dateOfBirth: boolean;
  bio: boolean;
  studentCode: boolean;
  studentYear: boolean;
  school: boolean;
  faculty: boolean;
  citizenId: boolean;
  citizenIdIssuedPlace: boolean;
  ethnicity: boolean;
  religion: boolean;
  province: boolean;
  district: boolean;
  ward: boolean;
  addressLine: boolean;
  emergencyContactName: boolean;
  emergencyContactPhoneNumber: boolean;
  emergencyContactAddress: boolean;
};

export function useUpdateProfile(initialProfile: ProfileData) {
  const [fullName, setFullName] = useState(initialProfile.fullName ?? "");
  const [email] = useState(initialProfile.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(
    initialProfile.phoneNumber ?? "",
  );
  const [gender, setGender] = useState<Gender | null>(
    initialProfile.gender ?? null,
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    initialProfile.dateOfBirth ?? "",
  );
  const [bio, setBio] = useState(initialProfile.bio ?? "");
  const [avatarUrl] = useState(initialProfile.avatarUrl ?? null);
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);

  const [studentCode, setStudentCode] = useState(initialProfile.studentCode ?? "");
  const [studentYear, setStudentYear] = useState(
    initialProfile.studentYear !== null && initialProfile.studentYear !== undefined
      ? String(initialProfile.studentYear)
      : "",
  );
  const [school, setSchool] = useState(initialProfile.school ?? "");
  const [faculty, setFaculty] = useState(initialProfile.faculty ?? "");

  const [citizenId, setCitizenId] = useState(initialProfile.citizenId ?? "");
  const [citizenIdIssuedPlace, setCitizenIdIssuedPlace] = useState(
    initialProfile.citizenIdIssuedPlace ?? "",
  );
  const [ethnicity, setEthnicity] = useState(initialProfile.ethnicity ?? "");
  const [religion, setReligion] = useState(initialProfile.religion ?? "");

  const [province, setProvince] = useState(initialProfile.province ?? "");
  const [district, setDistrict] = useState(initialProfile.district ?? "");
  const [ward, setWard] = useState(initialProfile.ward ?? "");
  const [addressLine, setAddressLine] = useState(
    initialProfile.addressLine ?? "",
  );

  const [emergencyContactName, setEmergencyContactName] = useState(
    initialProfile.emergencyContactName ?? "",
  );
  const [emergencyContactPhoneNumber, setEmergencyContactPhoneNumber] =
    useState(initialProfile.emergencyContactPhoneNumber ?? "");
  const [emergencyContactAddress, setEmergencyContactAddress] = useState(
    initialProfile.emergencyContactAddress ?? "",
  );

  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<TouchedState>({
    fullName: false,
    phoneNumber: false,
    gender: false,
    dateOfBirth: false,
    bio: false,
    studentCode: false,
    studentYear: false,
    school: false,
    faculty: false,
    citizenId: false,
    citizenIdIssuedPlace: false,
    ethnicity: false,
    religion: false,
    province: false,
    district: false,
    ward: false,
    addressLine: false,
    emergencyContactName: false,
    emergencyContactPhoneNumber: false,
    emergencyContactAddress: false,
  });

  const fullNameTrim = fullName.trim();
  const phoneTrim = phoneNumber.trim();
  const bioTrim = bio.trim();
  const emergencyPhoneTrim = emergencyContactPhoneNumber.trim();

  const fullNameErr = !touched.fullName
    ? null
    : !fullNameTrim
      ? "Vui lòng nhập họ và tên."
      : fullNameTrim.length < 2
        ? "Họ và tên tối thiểu 2 ký tự."
        : null;

  const phoneErr = !touched.phoneNumber
    ? null
    : phoneTrim && !isValidPhoneNumber(phoneTrim)
      ? "Số điện thoại không hợp lệ."
      : null;

  const emergencyPhoneErr = !touched.emergencyContactPhoneNumber
    ? null
    : emergencyPhoneTrim && !isValidPhoneNumber(emergencyPhoneTrim)
      ? "Số điện thoại người liên hệ không hợp lệ."
      : null;

  const bioErr = !touched.bio
    ? null
    : bioTrim.length > 200
      ? "Tiểu sử tối đa 200 ký tự."
      : null;

  const dateErr = useMemo(() => {
    if (!touched.dateOfBirth || !dateOfBirth) return null;
    const today = new Date().toISOString().split("T")[0];
    if (dateOfBirth > today) return "Ngày sinh không hợp lệ.";
    return null;
  }, [touched.dateOfBirth, dateOfBirth]);

  const isFormValid = useMemo(() => {
    const validName = fullNameTrim.length >= 2;
    const validPhone = !phoneTrim || isValidPhoneNumber(phoneTrim);
    const validEmergencyPhone =
      !emergencyPhoneTrim || isValidPhoneNumber(emergencyPhoneTrim);
    const validBio = bioTrim.length <= 200;

    const today = new Date().toISOString().split("T")[0];
    const validDob = !dateOfBirth || dateOfBirth <= today;

    return (
      validName && validPhone && validEmergencyPhone && validBio && validDob
    );
  }, [fullNameTrim, phoneTrim, emergencyPhoneTrim, bioTrim, dateOfBirth]);

  const previewAvatarUri = localAvatarUri || avatarUrl;

  function markAllTouched() {
    setTouched({
      fullName: true,
      phoneNumber: true,
      gender: true,
      dateOfBirth: true,
      bio: true,
      studentCode: true,
      studentYear: true,
      school: true,
      faculty: true,
      citizenId: true,
      citizenIdIssuedPlace: true,
      ethnicity: true,
      religion: true,
      province: true,
      district: true,
      ward: true,
      addressLine: true,
      emergencyContactName: true,
      emergencyContactPhoneNumber: true,
      emergencyContactAddress: true,
    });
  }

  async function submit(opts?: {
    onSuccess?: (updated: ProfileData) => void;
    onError?: (message: string) => void;
  }) {
    markAllTouched();

    if (!isFormValid) {
      opts?.onError?.("Vui lòng kiểm tra lại thông tin.");
      return;
    }

    try {
      setLoading(true);

      if (localAvatarUri) {
        console.log("[useUpdateProfile] Step 1: Uploading avatar...", localAvatarUri);
        const uploadRes = await uploadMyAvatar(localAvatarUri);
        console.log("[useUpdateProfile] Step 1 Success:", uploadRes);
      }

      const body = {
        fullName: fullNameTrim,
        phoneNumber: phoneTrim || null,
        gender,
        dateOfBirth: dateOfBirth || null,
        bio: bioTrim || null,
        studentCode: studentCode.trim() || null,

        studentYear: studentYear.replace(/\D/g, "") ? parseInt(studentYear.replace(/\D/g, ""), 10) : null,
        school: school.trim() || null,
        faculty: faculty.trim() || null,

        citizenId: citizenId.trim() || null,
        citizenIdIssuedPlace: citizenIdIssuedPlace.trim() || null,
        ethnicity: ethnicity.trim() || null,
        religion: religion.trim() || null,

        province: province.trim() || null,
        district: district.trim() || null,
        ward: ward.trim() || null,
        addressLine: addressLine.trim() || null,

        emergencyContactName: emergencyContactName.trim() || null,
        emergencyContactPhoneNumber: emergencyPhoneTrim || null,
        emergencyContactAddress: emergencyContactAddress.trim() || null,
      };

      // Check if any text fields changed
      const parseInitialYear = () => {
        if (initialProfile.studentYear === null || initialProfile.studentYear === undefined) return null;
        const cleaned = String(initialProfile.studentYear).replace(/\D/g, "");
        return cleaned ? parseInt(cleaned, 10) : null;
      };

      const hasTextChanged =
        body.fullName !== initialProfile.fullName ||
        body.phoneNumber !== (initialProfile.phoneNumber || null) ||
        body.gender !== (initialProfile.gender || null) ||
        body.dateOfBirth !== (initialProfile.dateOfBirth || null) ||
        body.bio !== (initialProfile.bio || null) ||
        body.studentCode !== (initialProfile.studentCode || null) ||
        body.studentYear !== parseInitialYear() ||
        body.school !== (initialProfile.school || null) ||
        body.faculty !== (initialProfile.faculty || null) ||
        body.citizenId !== (initialProfile.citizenId || null) ||
        body.citizenIdIssuedPlace !== (initialProfile.citizenIdIssuedPlace || null) ||
        body.ethnicity !== (initialProfile.ethnicity || null) ||
        body.religion !== (initialProfile.religion || null) ||
        body.province !== (initialProfile.province || null) ||
        body.district !== (initialProfile.district || null) ||
        body.ward !== (initialProfile.ward || null) ||
        body.addressLine !== (initialProfile.addressLine || null) ||
        body.emergencyContactName !== (initialProfile.emergencyContactName || null) ||
        body.emergencyContactPhoneNumber !== (initialProfile.emergencyContactPhoneNumber || null) ||
        body.emergencyContactAddress !== (initialProfile.emergencyContactAddress || null);

      let updated: ProfileData;
      if (hasTextChanged) {
        console.log("[useUpdateProfile] Step 2: Updating profile text...");
        console.log("[useUpdateProfile] Step 2 Request Body:", JSON.stringify(body, null, 2));
        updated = await updateMyProfile(body);
        console.log("[useUpdateProfile] Step 2 Success");
      } else {
        console.log("[useUpdateProfile] Profile text unchanged. Skipping updateMyProfile.");
        updated = await getMyProfile();
      }

      opts?.onSuccess?.(updated);
    } catch (err: any) {
      console.error("[useUpdateProfile] Submit failed. Error details:", {
        message: err?.message,
        status: err?.response?.status,
        data: JSON.stringify(err?.response?.data || {}, null, 2),
      });
      const message = getApiErrorMessage(err);
      opts?.onError?.(message);
    } finally {
      setLoading(false);
    }
  }

  return {
    fullName,
    email,
    phoneNumber,
    gender,
    dateOfBirth,
    bio,
    localAvatarUri,
    previewAvatarUri,
    loading,

    studentCode,
    studentYear,
    school,
    faculty,

    citizenId,
    citizenIdIssuedPlace,
    ethnicity,
    religion,

    province,
    district,
    ward,
    addressLine,

    emergencyContactName,
    emergencyContactPhoneNumber,
    emergencyContactAddress,

    fullNameErr,
    phoneErr,
    emergencyPhoneErr,
    dateErr,
    bioErr,
    isFormValid,

    setFullName,
    setPhoneNumber,
    setGender,
    setDateOfBirth,
    setBio,
    setLocalAvatarUri,
    setTouched,

    setStudentCode,
    setStudentYear,
    setSchool,
    setFaculty,

    setCitizenId,
    setCitizenIdIssuedPlace,
    setEthnicity,
    setReligion,

    setProvince,
    setDistrict,
    setWard,
    setAddressLine,

    setEmergencyContactName,
    setEmergencyContactPhoneNumber,
    setEmergencyContactAddress,

    submit,
  };
}
