import { useEffect, useState } from "react";
import axios from "../../services/api/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Verifications() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const collegeId = user?.profile?._id;
    if (!collegeId) {
      setLoading(false);
      return;
    }

    axios
      .get(`/api/colleges/${collegeId}/students`)
      .then((res) => {
        const list = Array.isArray(res.data?.data?.data)
          ? res.data.data.data
          : [];
        setStudents(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const approveStudent = async (studentId) => {
    try {
      await axios.post(`/api/colleges/verify-student/${studentId}`);

      // 🔥 Make button turn green immediately AND stay green after refresh
      setStudents((prev) =>
        prev.map((s) =>
          s._id === studentId
            ? { ...s, isVerifiedByCollege: true }
            : s
        )
      );
    } catch (e) {
      alert("Verification failed");
      console.error(e);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading students...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "16px" }}>Verify Students</h1>

      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Branch</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Year</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "12px" }}>
                  {s.firstName} {s.lastName}
                </td>
                <td style={{ padding: "12px" }}>{s.branch || "N/A"}</td>
                <td style={{ padding: "12px" }}>{s.yearOfStudy || "N/A"}</td>

                <td style={{ padding: "12px", display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => navigate(`/college/students/${s._id}`)}
                    style={{
                      background: "#0f766e",
                      color: "white",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() => approveStudent(s._id)}
                    disabled={s.isVerifiedByCollege}
                    style={{
                      background: s.isVerifiedByCollege
                        ? "#16a34a" // GREEN AFTER VERIFY
                        : "#2563eb", // BLUE BEFORE VERIFY
                      color: "white",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: s.isVerifiedByCollege
                        ? "not-allowed"
                        : "pointer",
                    }}
                  >
                    {s.isVerifiedByCollege ? "Verified ✔️" : "Verify"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
