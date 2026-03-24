import { getApiErrorMessage } from "@/services/apiError";
import {
  Gender,
  ProfileData,
  updateMyProfile,
  uploadMyAvatar,
} from "@/services/profile.api";
import { useMemo, useState } from "react";

function isValidPhoneNumber(phone: string) {
  const cleaned = phone.replace(/\s+/g, "");
  return /^[0-9+()-]{8,15}$/.test(cleaned);
}

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

  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    fullName: false,
    phoneNumber: false,
    gender: false,
    dateOfBirth: false,
    bio: false,
  });

  const fullNameTrim = fullName.trim();
  const phoneTrim = phoneNumber.trim();
  const bioTrim = bio.trim();

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
    const validBio = bioTrim.length <= 200;

    const today = new Date().toISOString().split("T")[0];
    const validDob = !dateOfBirth || dateOfBirth <= today;

    return validName && validPhone && validBio && validDob;
  }, [fullNameTrim, phoneTrim, bioTrim, dateOfBirth]);

  const previewAvatarUri = localAvatarUri || avatarUrl;

  function markAllTouched() {
    setTouched({
      fullName: true,
      phoneNumber: true,
      gender: true,
      dateOfBirth: true,
      bio: true,
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
        await uploadMyAvatar(localAvatarUri);
      }

      const updated = await updateMyProfile({
        fullName: fullNameTrim,
        phoneNumber: phoneTrim || null,
        gender,
        dateOfBirth: dateOfBirth || null,
        bio: bioTrim || null,
      });

      opts?.onSuccess?.(updated);
    } catch (err) {
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

    fullNameErr,
    phoneErr,
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

    submit,
  };
}
