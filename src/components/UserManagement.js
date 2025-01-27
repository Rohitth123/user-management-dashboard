import React, { useState, useEffect } from "react";

const App = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch users from the API
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
      if (!response.ok) throw new Error(`Failed to fetch users: ${response.status}`);
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email) {
      setError("Name and email are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (isEditing) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === formData.id ? { ...user, ...formData } : user
        )
      );
      setIsEditing(false);
    } else {
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
      };
      setUsers((prevUsers) => [newUser, ...prevUsers]);
    }

    setFormData({ id: null, name: "", email: "" });
  };

  // Handle edit button click
  const handleEdit = (user) => {
    setFormData(user);
    setIsEditing(true);
  };

  // Handle delete button click
  const handleDelete = (id) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Employee Management</h1>

      {/* Create/Update User Form */}
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2>{isEditing ? "Edit Employee" : "Create New Employee"}</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          {isEditing ? "Update Employee" : "Add Employee"}
        </button>
      </form>

      {/* Employee List */}
      <div style={styles.employeeList}>
        <h2>All Employees</h2>
        {loading ? (
          <p>Loading employees...</p>
        ) : users.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <div style={styles.grid}>
            {users.map((user) => (
              <EmployeeCard
                key={user.id}
                user={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Employee Card Component
const EmployeeCard = ({ user, onEdit, onDelete }) => (
  <div style={styles.card}>
    <h3>{user.name}</h3>
    <p>{user.email}</p>
    <div style={styles.actions}>
      <button style={styles.editButton} onClick={() => onEdit(user)}>
        Edit
      </button>
      <button style={styles.deleteButton} onClick={() => onDelete(user.id)}>
        Delete
      </button>
    </div>
  </div>
);

// Inline styles for simplicity
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    border: "1px solid #ccc",
    padding: "15px",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
    marginBottom: "30px",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  employeeList: {
    marginTop: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "1px solid #ccc",
    padding: "15px",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  actions: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  editButton: {
    backgroundColor: "#ffc107",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "5px 10px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "5px 10px",
    cursor: "pointer",
  },
};

export default App;
