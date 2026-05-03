import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";

export default function LandingPage({ 
  onAdminLogin, 
  onAdminRegister, 
  onAdminCellLogin, 
  onAdminCellRegister, 
  style = {} 
}) {
  const [views, setViews] = useState([]);
  const [totalViews, setTotalViews] = useState(0);

  // ✅ Fetch views from backend on page load
  useEffect(() => {
    const fetchViews = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/admin/students/views");
        setViews(res.data);

        // ✅ Calculate total
        const total = res.data.reduce((sum, v) => sum + (v.count || 0), 0);
        setTotalViews(total);
      } catch (err) {
        console.error("❌ Error fetching views:", err);
      }
    };

    fetchViews();
  }, []);

  // ✅ Helper function to get count per source
  const getCount = (source) => views.find((v) => v.source === source)?.count || 0;

  // ✅ Default container style
  const defaultStyle = {
    padding: "2rem",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    color: "#333",
    borderRadius: "10px",
    margin: "2rem auto",
    maxWidth: "900px",
    minHeight: "34rem",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  };

  const mergedStyle = { ...defaultStyle, ...style };

  const buttonStyle = {
    padding: "0.8rem 1.6rem",
    margin: "0.5rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  };

  const sectionTitle = { margin: "1rem 0", color: "#444" };

  return (
    <>
      <Header />

      <div style={mergedStyle}>
        <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          🌐 Welcome to Our Portal
        </h2>
        <p style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
          Please select your role to continue:
        </p>

        {/* ✅ View Statistics */}
        <div style={{ marginBottom: "2rem" }}>
          <h2>📊 View Statistics</h2>
          <h3>👀 Total Views: {totalViews}</h3>

          <ul style={{ listStyle: "none", padding: 0, fontSize: "18px" }}>
            <li>📘 Facebook : {getCount("facebook")}</li>
            <li>📸 Instagram : {getCount("instagram")}</li>
            <li>🐦 Twitter : {getCount("twitter")}</li>
            <li>▶️ YouTube : {getCount("youtube")}</li>
            <li>🔗 Direct : {getCount("direct")}</li>
          </ul>
        </div>

        {/* ✅ Admin Section */}
        <div>
          <h3 style={sectionTitle}>👨‍💼 Main Admin</h3>
          <button 
            onClick={onAdminLogin} 
            style={{ ...buttonStyle, backgroundColor: "#003366" }}
          >
            🔐 Admin Login
          </button>
          <button 
            onClick={onAdminRegister} 
            style={{ ...buttonStyle, backgroundColor: "#0066cc" }}
          >
            📝 Admin Register
          </button>
        </div>

        <hr style={{ margin: "2.5rem 0", border: "1px solid #ddd" }} />

        {/* ✅ Admin Cell Section */}
        <div>
          <h3 style={sectionTitle}>🏫 Admin Cell</h3>
          <button 
            onClick={onAdminCellLogin} 
            style={{ ...buttonStyle, backgroundColor: "#663399" }}
          >
            🔐 Admin Cell Login
          </button>
          <button 
            onClick={onAdminCellRegister} 
            style={{ ...buttonStyle, backgroundColor: "#9900cc" }}
          >
            📝 Admin Cell Register
          </button>
        </div>
      </div>
    </>
  );
}
