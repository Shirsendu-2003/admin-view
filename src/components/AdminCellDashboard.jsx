import React, { useEffect, useState } from 'react';

import axiosInstance from '../services/api';



/**
 * AdminCellDashboard component for viewing student forms and adding remarks.
 * This dashboard is for users with the 'ADMIN_CELL' role.
 *
 * @param {object} props - Component props.
 * @param {function} props.onLogout - Function to handle user logout.
 */
export default function AdminCellDashboard({ onLogout }) {
  // State to hold student data
  const [students, setStudents] = useState([]);
  // State to hold the name of the logged-in admin cell
  const [adminCellName, setAdminCellName] = useState('');
  // State to manage remarks for each student before saving
  const [remarks, setRemarks] = useState({});
  // State for error messages
  const [error, setError] = useState('');
  // State for success messages
  const [successMessage, setSuccessMessage] = useState('');
  // State for a loading indicator
  const [loading, setLoading] = useState(true);

  // useEffect hook to fetch initial data on component mount
  useEffect(() => {
    // Inner async function to fetch admin cell's name
    const fetchAdminCellInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axiosInstance.get('/admincell/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdminCellName(res.data.name);
      } catch (err) {
        console.error('Failed to fetch admin cell info:', err);
        setAdminCellName('Admin Cell'); // Fallback name
      }
    };

    // Inner async function to fetch all student forms
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axiosInstance.get('/admincell/students', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data);
        // Initialize the remarks state with existing remarks from the fetched data
        const initialRemarks = res.data.reduce((acc, student) => {
          acc[student.id] = student.remark || '';
          return acc;
        }, {});
        setRemarks(initialRemarks);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch student data:', err);
        setError('Failed to fetch student data.');
        setLoading(false);
      }
    };

    fetchAdminCellInfo();
    fetchStudents();
  }, []);

  /**
   * Handles saving a remark for a specific student.
   * Sends a PUT request to the backend with the student ID and remark.
   *
   * @param {number} studentId - The ID of the student to update.
   */
  const handleSaveRemark = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      const remark = remarks[studentId];
      if (remark === undefined) {
          setError('Remark field is empty.');
          return;
      }
      
      const res = await axiosInstance.put(
        `/admincell/students/${studentId}/remark`,
        { remark },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Update the student list with the new remark from the response
      setStudents(prevStudents =>
        prevStudents.map(student =>
          student.id === studentId ? res.data : student
        )
      );

      setSuccessMessage(`Remark for student ${studentId} saved successfully!`);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      setError('');
    } catch (err) {
      console.error('Failed to save remark:', err);
      setError(`Failed to save remark for student ${studentId}.`);
      setSuccessMessage('');
    }
  };

  /**
   * Updates the remarks state when a user types in a remark field.
   *
   * @param {number} studentId - The ID of the student.
   * @param {string} value - The new value of the remark.
   */
  const handleRemarkChange = (studentId, value) => {
    setRemarks(prevRemarks => ({
      ...prevRemarks,
      [studentId]: value,
    }));
  };

  // Render loading state while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="text-2xl font-bold text-gray-800">
          📝 Welcome, {adminCellName}
        </h2>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>

      {/* Message banners for success and error */}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {error && (
        <div className="error-message">{error}</div>
      )}

      <div>
        <table className="students-table">
          <thead>
            <tr>
              <th colSpan="7" className="form-header">
                📄 Submitted Student Forms
              </th>
            </tr>
            <tr className="table-header">
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date & Time</th>
              <th>Phone No</th>
              <th>Remark</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.updatedAt ? new Date(s.updatedAt).toLocaleDateString() : 'N/A'}</td>
                <td>{s.phone}</td>
                <td>
                  <input
                    type="text"
                    value={remarks[s.id] || ''}
                    onChange={(e) => handleRemarkChange(s.id, e.target.value)}
                    className="remark-input"
                    placeholder="Add remark..."
                  />
                </td>
                <td>
                  <button
                    onClick={() => handleSaveRemark(s.id)}
                    className="save-remark-btn"
                  >
                    💾 Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`
        body {
          font-family: 'Inter', sans-serif;
          background-color: #f3f4f6;
          color: #1f2937;
        }
        .dashboard-container {
          max-width: 1200px;
          margin: 40px auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e7eb;
        }
        .logout-button {
          padding: 8px 16px;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.3s;
        }
        .logout-button:hover {
          background-color: #dc2626;
        }
        .students-table {
          
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .form-header {
          background-color: #2563eb;
          color: white;
          padding: 16px;
          text-align: center;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .table-header th {
          background-color: #e5e7eb;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #4b5563;
          border-bottom: 2px solid #d1d5db;
        }
        .students-table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        .students-table tbody tr:nth-child(odd) {
          background-color: #f9fafb;
        }
        .students-table tbody tr:hover {
          background-color: #f3f4f6;
          transition: background-color 0.2s;
        }
        .remark-input {
          width: 85%;
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
          transition: border-color 0.2s;
        }
        .remark-input:focus {
          outline: none;
          border-color: #2563eb;
        }
        .save-remark-btn {
          padding: 6px 12px;
          background-color: #22c55e;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.3s;
          display: block;
          margin-top: 4px;
        }
        .save-remark-btn:hover {
          background-color: #16a34a;
        }
        .error-message {
          background-color: #fee2e2;
          color: #991b1b;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #fca5a5;
          text-align: center;
          font-weight: 500;
        }
        .success-message {
          background-color: #d1fae5;
          color: #065f46;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #6ee7b7;
          text-align: center;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
