export default function StudentDirectory({
    students,
    search,
    departmentFilter,
    departments,
    onSearchChange,
    onDepartmentChange,
    onEdit,
    onDelete,
  }) {
    const hasFilters = search.trim() !== "" || departmentFilter !== "all";
  
    return (
      <section className="panel directory-panel" id="directory">
        <div className="directory-heading">
          <div>
            <p className="eyebrow">Records</p>
            <h2>Student directory</h2>
            <p className="section-intro">
              Browse and maintain the university’s student records.
            </p>
          </div>
  
          <div className="directory-controls">
            <label className="visually-hidden" htmlFor="student-search">
              Search by name, email, or student ID
            </label>
            <input
              id="student-search"
              className="search-input"
              type="search"
              placeholder="Search records…"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
  
            <label className="visually-hidden" htmlFor="department-filter">
              Filter by department
            </label>
            <select
              id="department-filter"
              className="filter-select"
              value={departmentFilter}
              onChange={(event) => onDepartmentChange(event.target.value)}
            >
              <option value="all">All departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        {students.length === 0 ? (
          <div className="empty-state">
            <span className="empty-rule" aria-hidden="true" />
            <h3>{hasFilters ? "No matching records" : "No student records yet"}</h3>
            <p>
              {hasFilters
                ? "Try another search term or clear the department filter."
                : "Add a student using the registration form to begin your directory."}
            </p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Student</th>
                  <th scope="col">Student ID</th>
                  <th scope="col">Department</th>
                  <th scope="col">Semester</th>
                  <th scope="col">Phone</th>
                  <th scope="col"><span className="visually-hidden">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td data-label="Student">
                      <span className="student-name">{student.name}</span>
                      <a className="student-email" href={`mailto:${student.email}`}>
                        {student.email}
                      </a>
                    </td>
                    <td data-label="Student ID">
                      <span className="student-id">{student.id}</span>
                    </td>
                    <td data-label="Department">{student.department}</td>
                    <td data-label="Semester">Semester {student.semester}</td>
                    <td data-label="Phone">{student.phone}</td>
                    <td data-label="Actions">
                      <div className="row-actions">
                        <button
                          type="button"
                          className="text-button"
                          onClick={() => onEdit(student)}
                          aria-label={`Edit ${student.name}`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-button delete-button"
                          onClick={() => onDelete(student)}
                          aria-label={`Delete ${student.name}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    );
  }