import { useEffect, useState } from "react";
import { DEPARTMENTS } from "../data/departments.js";

const EMPTY_FORM = {
  name: "",
  email: "",
  department: "",
  semester: "",
  phone: "",
};

export default function StudentForm({
  editingStudent,
  onSubmit,
  onCancelEdit,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingStudent) {
      setForm({
        name: editingStudent.name,
        email: editingStudent.email,
        department: editingStudent.department,
        semester: String(editingStudent.semester),
        phone: editingStudent.phone,
      });
      setError("");
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editingStudent]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const cleanedForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      department: form.department,
      semester: form.semester,
      phone: form.phone.trim(),
    };

    if (
      !cleanedForm.name ||
      !cleanedForm.email ||
      !cleanedForm.department ||
      !cleanedForm.semester ||
      !cleanedForm.phone
    ) {
      setError("Please complete every field before saving.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(cleanedForm.email)) {
      setError("Enter a valid email address.");
      return;
    }

    onSubmit({
      ...cleanedForm,
      semester: Number(cleanedForm.semester),
    });

    if (!editingStudent) {
      setForm(EMPTY_FORM);
    }
    setError("");
  }

  function handleCancel() {
    setForm(EMPTY_FORM);
    setError("");
    onCancelEdit();
  }

  return (
    <section className="panel form-panel" aria-labelledby="form-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Student administration</p>
          <h2 id="form-heading">
            {editingStudent ? "Update student record" : "Register a student"}
          </h2>
        </div>
        {editingStudent && <span className="editing-tag">Editing</span>}
      </div>

      <p className="section-intro">
        {editingStudent
          ? `Changes will be saved to ${editingStudent.id}.`
          : "Enter the student’s details to create a new record."}
      </p>

      <form className="student-form" onSubmit={handleSubmit} noValidate>
        <label className="field field-wide">
          <span>Full name</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            placeholder="e.g. Morgan Ellis"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span>Email address</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@university.edu"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span>Phone number</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+1 555 010 1234"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span>Department</span>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          >
            <option value="">Select department</option>
            {DEPARTMENTS.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Semester</span>
          <select
            name="semester"
            value={form.semester}
            onChange={handleChange}
            required
          >
            <option value="">Select semester</option>
            {Array.from({ length: 8 }, (_, index) => index + 1).map(
              (semester) => (
                <option key={semester} value={semester}>
                  Semester {semester}
                </option>
              ),
            )}
          </select>
        </label>

        {error && <p className="form-error field-wide" role="alert">{error}</p>}

        <div className="form-actions field-wide">
          {editingStudent && (
            <button
              type="button"
              className="button button-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="button button-primary">
            {editingStudent ? "Save changes" : "Add student"}
          </button>
        </div>
      </form>
    </section>
  );
}