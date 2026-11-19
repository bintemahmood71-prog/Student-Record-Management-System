export const STORAGE_KEY = "northfield-student-records";

export function createStudentId(existingStudents) {
  const existingIds = new Set(existingStudents.map((student) => student.id));

  // Randomized ID with a collision check; the loop ensures uniqueness
  // within the current record set.
  let id;

  do {
    id = `NF-${Math.floor(100000 + Math.random() * 900000)}`;
  } while (existingIds.has(id));

  return id;
}

export function loadStudents() {
  try {
    const savedRecords = localStorage.getItem(STORAGE_KEY);

    if (!savedRecords) return [];

    const parsedRecords = JSON.parse(savedRecords);
    return Array.isArray(parsedRecords) ? parsedRecords : [];
  } catch {
    return [];
  }
}