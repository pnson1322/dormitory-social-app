export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "Mới đây";
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  } catch {
    return "Mới đây";
  }
}

export function getInitials(nameOrId?: string, fallbackName?: string): string {
  const isId = nameOrId && (/^[0-9a-fA-F-]+$/.test(nameOrId) || !/[a-zA-Z]/.test(nameOrId));
  const targetName = (nameOrId && !isId) ? nameOrId : (fallbackName || "Sinh viên KTX");
  return targetName.trim().split(" ").pop()?.slice(0, 2).toUpperCase() || "SV";
}

export function isValidAvatarUrl(url?: string): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.includes("sforum") ||
    trimmed.includes("cellphones.com.vn") ||
    trimmed.includes("/post/") ||
    trimmed.includes("/article/") ||
    trimmed.includes("/forum/")
  ) {
    return false;
  }
  if (
    trimmed === "" ||
    trimmed === "null" ||
    trimmed === "undefined" ||
    trimmed === "default" ||
    trimmed.endsWith("/null") ||
    trimmed.endsWith("/undefined") ||
    trimmed.endsWith("/default")
  ) {
    return false;
  }
  // Must start with http://, https://, file://, or data:
  if (!/^https?:\/\//i.test(trimmed) && !/^file:\/\//i.test(trimmed) && !/^data:/i.test(trimmed)) {
    return false;
  }
  return true;
}
