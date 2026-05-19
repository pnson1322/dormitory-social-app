export function formatDateToDisplay(date: string | null) {
  if (!date) return "Chưa cập nhật";

  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;

  return `${day}/${month}/${year}`;
}

export function formatDateTime(isoString: string | null) {
  if (!isoString) return "Chưa cập nhật";
  try {
    const d = new Date(isoString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (e) {
    return isoString;
  }
}

export function calculateAge(date: string | null) {
  if (!date) return null;

  const birth = new Date(date);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export function genderToVietnamese(gender: "Male" | "Female" | "Other" | null) {
  if (gender === "Male") return "Nam";
  if (gender === "Female") return "Nữ";
  if (gender === "Other") return "Khác";
  return "Chưa cập nhật";
}
