import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../services/api/client";
import Spinner from "../../components/common/Spinner/Spinner";

export default function StudentProfileForCollege() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------- SINGLE SOURCE OF TRUTH FETCH ----------
  const fetchEverything = async () => {
    try {
      setLoading(true);

      // 1️⃣ Get student profile (includes achievements in DB)
      const studentRes = await axios.get(`/api/students/${id}`);

      // 2️⃣ Get pending achievements (ONLY to catch new ones)
      const pendingRes = await axios.get(`/api/achievements/pending`);

      const studentAchievements = Array.isArray(studentRes.data?.data?.achievements)
        ? studentRes.data.data.achievements
        : [];

      const allPending = Array.isArray(pendingRes.data?.data?.data)
        ? pendingRes.data.data.data
        : [];

      // 3️⃣ Filter pending only for THIS student
      const myPending = allPending.filter(a => a.studentId?._id === id);

      // 4️⃣ MERGE (avoid duplicates)
      const merged = [
        ...studentAchievements,
        ...myPending.filter(
          p => !studentAchievements.some(a => a._id === p._id)
        ),
      ];

      setStudent(studentRes.data.data);
      setAchievements(merged);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEverything();
  }, [id]);

  // --------- VERIFY ACHIEVEMENT ----------
  const verifyAchievement = async (achievementId) => {
    try {
      await axios.post(
        `/api/achievements/${achievementId}/verify`,
        {
          status: "verified",
          comments: "Verified by college",
        }
      );

      alert("Achievement verified ✅");

      // 🔥 IMPORTANT: update UI locally so nothing disappears
      setAchievements(prev =>
        prev.map(a =>
          a._id === achievementId
            ? { ...a, verificationStatus: "verified" }
            : a
        )
      );
    } catch (e) {
      console.error("Verify error:", e.response?.data || e);
      alert("Verification failed ❌ — check console");
    }
  };

  if (loading) return <Spinner size="lg" />;

  if (!student) {
    return <p style={{ padding: "20px" }}>Student not found.</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <button onClick={() => navigate("/college/students")} style={{ marginBottom: "12px" }}>
        ← Back to Students
      </button>

      <h1>
        {student.firstName} {student.lastName}
      </h1>

      <p><b>Branch:</b> {student.branch || "N/A"}</p>
      <p><b>Year:</b> {student.yearOfStudy || "N/A"}</p>
      <p><b>Enrollment No:</b> {student.enrollmentNumber || "N/A"}</p>

      <hr style={{ margin: "16px 0" }} />

      <h3>Skills</h3>
      {student.skills?.length ? (
        <ul>
          {student.skills.map((s, i) => (
            <li key={i}>{s.name || s}</li>
          ))}
        </ul>
      ) : (
        <p>No skills listed.</p>
      )}

      <hr style={{ margin: "16px 0" }} />

      <h3>Projects</h3>
      {student.projects?.length ? (
        <ul>
          {student.projects.map((p) => (
            <li key={p._id}>{p.title}</li>
          ))}
        </ul>
      ) : (
        <p>No projects added yet.</p>
      )}

      <hr style={{ margin: "16px 0" }} />

      <h3>All Achievements</h3>

      {achievements.length === 0 ? (
        <p>No achievements found for this student.</p>
      ) : (
        achievements.map(a => {
          const isVerified = a.verificationStatus === "verified";

          return (
            <div
              key={a._id}
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "8px",
                background: isVerified ? "#f0fff4" : "#fff",
              }}
            >
              <h4>{a.title}</h4>
              <p>{a.description}</p>
              <p><b>Issuer:</b> {a.issuer}</p>
              <p><b>Type:</b> {a.type}</p>

              <p>
                <b>Status:</b>{" "}
                {isVerified ? "✅ Verified" : "⏳ Pending"}
              </p>

              {isVerified ? (
                <button
                  style={{
                    background: "#16a34a",
                    color: "white",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "none",
                    marginTop: "8px",
                  }}
                >
                  Verified ✅
                </button>
              ) : (
                <button
                  onClick={() => verifyAchievement(a._id)}
                  style={{
                    background: "#2563eb",
                    color: "white",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    marginTop: "8px",
                  }}
                >
                  Verify Achievement
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
