export type TermOption = {
  id: string;
  label: string;
};

export function getUpcomingTerms(): TermOption[] {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; 
  const currentYear = now.getFullYear();

  let startYear = currentYear;
  if (currentMonth >= 1 && currentMonth <= 8) {
    startYear = currentYear - 1;
  }


  let currentTermType: "HK1" | "HK2" | "HKH" = "HK1";
  let academicStartYear = startYear;

  if (currentMonth >= 9 && currentMonth <= 12) {
    currentTermType = "HK1";
    academicStartYear = currentYear;
  } else if (currentMonth >= 1 && currentMonth <= 6) {
    currentTermType = "HK2";
    academicStartYear = currentYear - 1;
  } else if (currentMonth >= 7 && currentMonth <= 8) {
    currentTermType = "HKH";
    academicStartYear = currentYear - 1;
  }

  let nextTermType: "HK1" | "HK2" | "HKH" = "HK1";
  let nextAcademicStartYear = academicStartYear;

  if (currentTermType === "HK1") {
    nextTermType = "HK2";
  } else if (currentTermType === "HK2") {
    nextTermType = "HKH";
  } else {
    nextTermType = "HK1";
    nextAcademicStartYear++;
  }

  let termLabel = "";
  if (nextTermType === "HK1") {
    termLabel = `Học kỳ 1`;
  } else if (nextTermType === "HK2") {
    termLabel = `Học kỳ 2`;
  } else {
    termLabel = `Học kỳ Hè`;
  }

  return [{
    id: `${nextTermType}_${nextAcademicStartYear}_${nextAcademicStartYear + 1}`,
    label: `${termLabel} (${nextAcademicStartYear}-${nextAcademicStartYear + 1})`,
  }];
}
