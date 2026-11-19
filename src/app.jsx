
import { useEffect, useMemo, useState } from "react";
import "./index.css";

const DEPARTMENTS = [
  "Environmental Science",
  "Computer Science",
  "Commerce",
  "Communication",
  "Tourism",
  "Education",
  "Criminology",
  "Political Science",
  "Nursing",
  "Management"
];

const STORAGE_KEY = "gpgc-mardan-student-records";

const INITIAL_STUDENTS = [
  {
    id: "GPGC-001",
    name: "Ayeza Mahmood",
    email: "ayeza@example.com",
    department: "Computer Science",
    semester: "7",
    phone: "03001234567"
  },
  {
    id: "GPGC-002",
    name: "Sara Ahmed",
    email: "sara@example.com",
    department: "Education",
    semester: "5",
    phone: "03111234567"
  },
  {
    id: "GPGC-003",
    name: "Fatima Khan",
    email: "fatima@example.com",
    department: "Environmental Science",
    semester: "3",
    phone: "03221234567"
  },
  {
    id: "GPGC-004",
    name: "Maryam Ali",
    email: "maryam@example.com",
    department: "Commerce",
    semester: "6",
    phone: "03331234567"
  },
  {
    id: "GPGC-005",
    name: "Hira Shah",
    email: "hira@example.com",
    department: "Computer Science",
    semester: "4",
    phone: "03441234567"
  }
];

const EMPTY_FORM = {
  name: "",
  email: "",
  department: "",
  semester: "",
  phone: ""
};

function getInitialStudents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === null) return INITIAL_STUDENTS;

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : INITIAL_STUDENTS;
  } catch {
    return INITIAL_STUDENTS;
  }
}

function generateStudentId(students) {
  let number = students.length + 1;
  let id = `GPGC-${String(number).padStart(3, "0")}`;

  while (students.some((student) => student.id === id)) {
    number += 1;
    id = `GPGC-${String(number).padStart(3, "0")}`;
  }

  return id;
}

// Academic emblem: original college-inspired design.
function CollegeEmblem() {
  return (
    <div className="college-emblem" aria-label="Academic emblem">
      <svg
        viewBox="0 0 64 64"
        width="38"
        height="38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 23L32 10L57 23L32 36L7 23Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M17 29V42C26 49 38 49 47 42V29"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M57 23V39"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M53 43H61"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M21 43H43"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function App() {
  const [students, setStudents] = useState(getInitialStudents);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [activeDepartment, setActiveDepartment] = useState("All");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [formOpen, setFormOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Save records in browser storage.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (error) {
      console.error("Unable to save records:", error);
      setMessage("Unable to save records in browser storage.");
      setMessageType("error");
    }
  }, [students]);

  // Calculate department totals from actual records.
  const departmentCounts = useMemo(() => {
    return DEPARTMENTS.map((department) => ({
      name: department,
      count: students.filter(
        (student) => student.department === department
      ).length
    }));
  }, [students]);

  // Search and department filtering.
  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term) ||
        student.id.toLowerCase().includes(term);

      const matchesDepartment =
        activeDepartment === "All" ||
        student.department === activeDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [students, search, activeDepartment]);

  const totalDepartments = departmentCounts.filter(
    (department) => department.count > 0
  ).length;

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // Add or update a student.
  const handleSubmit = (event) => {
    event.preventDefault();

    const cleaned = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      department: formData.department,
      semester: formData.semester,
      phone: formData.phone.trim()
    };

    if (Object.values(cleaned).some((value) => !value)) {
      showMessage("Please complete all the fields.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }

    if (!/^[0-9+\-\s()]{7,20}$/.test(cleaned.phone)) {
      showMessage("Please enter a valid phone number.", "error");
      return;
    }

    const duplicateEmail = students.some(
      (student) =>
        student.email.toLowerCase() === cleaned.email &&
        student.id !== editingId
    );

    if (duplicateEmail) {
      showMessage("This email address is already registered.", "error");
      return;
    }

    if (editingId) {
      setStudents((previous) =>
        previous.map((student) =>
          student.id === editingId
            ? { ...cleaned, id: editingId }
            : student
        )
      );

      showMessage("Student record updated successfully.");
    } else {
      const newStudent = {
        ...cleaned,
        id: generateStudentId(students)
      };

      setStudents((previous) => [newStudent, ...previous]);

      showMessage("New student registered successfully.");
    }

    setFormData(EMPTY_FORM);
    setEditingId(null);
    setFormOpen(false);
  };

  // Open form for editing.
  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      email: student.email,
      department: student.department,
      semester: student.semester,
      phone: student.phone
    });

    setEditingId(student.id);
    setFormOpen(true);
    setMessage("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete student.
  const handleDelete = (id) => {
    const student = students.find((item) => item.id === id);

    if (!student) return;

    const confirmed = window.confirm(
      `Delete the record of ${student.name}?`
    );

    if (!confirmed) return;

    setStudents((previous) =>
      previous.filter((item) => item.id !== id)
    );

    if (editingId === id) {
      resetForm();
    }

    showMessage("Student record deleted successfully.");
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setFormOpen(false);
  };

  const handleDepartmentClick = (department) => {
    setActiveDepartment(department);
    document.getElementById("student-directory")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  const handleClearFilters = () => {
    setSearch("");
    setActiveDepartment("All");
  };

  return (
    <main className="screen">
      <div className="dashboard">

        {/* HEADER */}
        <header className="topbar">
          <div className="college">
            <CollegeEmblem />
            <div className="college-name">
              <strong>Government Post Graduate College Mardan</strong>
             
            </div>
          </div>

          <div className="header-right">
  <span className="academic-label">
    ACADEMIC RECORDS
  </span>

  <div className="profile-container">
    <button
      className="profile-mark"
      onClick={() => setProfileOpen(!profileOpen)}
      aria-label="Open profile menu"
      aria-expanded={profileOpen}
    >
      A
    </button>

    {profileOpen && (
      <div className="profile-dropdown">
        <strong>Administrator</strong>
        <span>College Management</span>
        <div className="profile-divider"></div>
        <button onClick={() => {
          setProfileOpen(false);
          showMessage("You are viewing the administrator dashboard.");
        }}>
          Dashboard
        </button>
        <button onClick={() => {
          setProfileOpen(false);
          showMessage("Student record management is active.");
        }}>
          Account information
        </button>
      </div>
    )}
  </div>
</div>
        </header>

        {/* INTRODUCTION */}
        <section className="welcome-section">
          <div>
            <p className="eyebrow">COLLEGE ADMINISTRATION</p>
            <h1>Student Records</h1>
            <p className="welcome-description">
              A central place to manage student information
              and maintain academic records.
            </p>
          </div>

          <button
            className="add-main-button"
            onClick={() => {
              resetForm();
              setFormOpen(true);
            }}
          >
            <span>+</span> Register student
          </button>
        </section>

        {/* NOTIFICATION */}
        {message && (
          <div
            className={`notification ${messageType}`}
            role="status"
          >
            <span>{message}</span>
            <button
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* STATISTICS */}
        <section className="stats" aria-label="Statistics">
          <article className="stat-card">
            <span className="stat-caption">TOTAL ENROLMENT</span>
            <strong>{students.length}</strong>
            <span className="stat-description">
              Registered student records
            </span>
          </article>

          <article className="stat-card">
            <span className="stat-caption">ACTIVE DEPARTMENTS</span>
            <strong>{totalDepartments}</strong>
            <span className="stat-description">
              Departments with student records
            </span>
          </article>

          <article className="stat-card">
            <span className="stat-caption">DISPLAYED RECORDS</span>
            <strong>{filteredStudents.length}</strong>
            <span className="stat-description">
              Current directory results
            </span>
          </article>
        </section>

        {/* MAIN WORKSPACE */}
        <section className="workspace">

          {/* DEPARTMENTS */}
          <aside className="department-card">
            <div className="department-heading">
              <div>
                <p className="section-kicker">ACADEMIC UNITS</p>
                <h2>Departments</h2>
              </div>
              <span className="department-total">
                {DEPARTMENTS.length}
              </span>
            </div>

            <button
              className={`department-item ${
                activeDepartment === "All" ? "active" : ""
              }`}
              onClick={() => handleDepartmentClick("All")}
            >
              <span className="department-symbol">⌂</span>
              <span>All departments</span>
              <span className="department-count">
                {students.length}
              </span>
            </button>

            <div className="department-list">
              {departmentCounts.map((department, index) => (
                <button
                  key={department.name}
                  className={`department-item ${
                    activeDepartment === department.name
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleDepartmentClick(department.name)
                  }
                >
                  <span className={`department-symbol color-${index % 5}`}>
                    ◈
                  </span>

                  <span className="department-name">
                    {department.name}
                  </span>

                  <span className="department-count">
                    {department.count}
                  </span>
                </button>
              ))}
            </div>

            <p className="department-footnote">
              Select a department to view its students.
            </p>
          </aside>

          {/* STUDENT DIRECTORY */}
          <section className="directory-card" id="student-directory">
            <div className="directory-heading">
              <div>
                <p className="section-kicker">STUDENT INFORMATION</p>
                <h2>
                  {activeDepartment === "All"
                    ? "Student directory"
                    : activeDepartment}
                </h2>
                <p className="directory-description">
                  Browse and manage registered student records.
                </p>
              </div>

              <span className="record-count">
                {filteredStudents.length} RECORDS
              </span>
            </div>

            {/* SEARCH */}
            <div className="directory-tools">
              <div className="search-box">
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  placeholder="Search by name, email or student ID..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search student records"
                />
              </div>

              <button
                className="clear-button"
                onClick={handleClearFilters}
              >
                Clear filters
              </button>
            </div>

            {/* TABLE */}
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>STUDENT</th>
                    <th>DEPARTMENT</th>
                    <th>SEMESTER</th>
                    <th>PHONE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td>
                          <div className="student-cell">
                            <span className="student-avatar">
                              {student.name.charAt(0).toUpperCase()}
                            </span>

                            <div>
                              <strong>{student.name}</strong>
                              <span>{student.email}</span>
                              <small>{student.id}</small>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="table-department">
                            {student.department}
                          </span>
                        </td>

                        <td>
                          <span className="semester-tag">
                            Semester {student.semester}
                          </span>
                        </td>

                        <td className="phone-cell">
                          {student.phone}
                        </td>

                        <td>
                          <div className="action-buttons">
                            <button
                              className="edit-button"
                              onClick={() => handleEdit(student)}
                            >
                              Edit
                            </button>

                            <button
                              className="delete-button"
                              onClick={() => handleDelete(student.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">
                        <div className="empty-state">
                          <span>⌕</span>
                          <h3>No student records found</h3>
                          <p>
                            Try another search or register a new student.
                          </p>
                          <button onClick={handleClearFilters}>
                            Show all records
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <span>
                Showing {filteredStudents.length} of {students.length} students
              </span>
              <span>Student Administration · Mardan</span>
            </div>
          </section>
        </section>

        {/* REGISTRATION FORM */}
        {formOpen && (
          <div
            className="modal-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) resetForm();
            }}
          >
            <section
              className="student-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="form-title"
            >
              <div className="modal-heading">
                <div>
                  <p className="section-kicker">
                    STUDENT REGISTRATION
                  </p>
                  <h2 id="form-title">
                    {editingId ? "Update student" : "New student"}
                  </h2>
                  <p>Enter accurate academic and contact details.</p>
                </div>

                <button
                  className="close-modal"
                  onClick={resetForm}
                  aria-label="Close form"
                  type="button"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-form-grid">
                  <div className="form-field full-width">
                    <label htmlFor="student-name">Full name</label>
                    <input
                      id="student-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter student's full name"
                      autoFocus
                    />
                  </div>

                  <div className="form-field full-width">
                    <label htmlFor="student-email">Email address</label>
                    <input
                      id="student-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="student@example.com"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="student-department">Department</label>
                    <select
                      id="student-department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                    >
                      <option value="">Select department</option>
                      {DEPARTMENTS.map((department) => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="student-semester">Semester</label>
                    <select
                      id="student-semester"
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                    >
                      <option value="">Select semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                        <option key={number} value={String(number)}>
                          Semester {number}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field full-width">
                    <label htmlFor="student-phone">Phone number</label>
                    <input
                      id="student-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="03XXXXXXXXX"
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-cancel"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="modal-submit">
                    {editingId ? "Save changes" : "Register student"}
                    <span>→</span>
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}

        <footer className="footer">
          <span>Government Post Graduate College Mardan</span>
          <span>Student Record Management System</span>
        </footer>
      </div>
    </main>
  );
}

export default App;
