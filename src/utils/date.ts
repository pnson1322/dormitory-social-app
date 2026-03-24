export function formatDateToDisplay(date: string | null) {
  if (!date) return "--/--/----";

  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;

  return `${day}/${month}/${year}`;
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

export function genderToVietnamese(gender: "male" | "female" | "other" | null) {
  if (gender === "male") return "Nam";
  if (gender === "female") return "Nữ";
  if (gender === "other") return "Khác";
  return "Chưa cập nhật";
}
