import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';
import AdminDashboard from './components/AdminDashboard';
import AdminCellLogin from './components/AdminCellLogin';
import AdminCellRegister from './components/AdminCellRegister';
import AdminCellDashboard from './components/AdminCellDashboard';
import Footer from "./components/Footer";

export default function App() {
  const [view, setView] = useState('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null); // "admin" | "admincell"

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    if (token && storedRole) {
      setIsLoggedIn(true);
      setRole(storedRole);
      setView(storedRole === 'admin' ? 'adminDashboard' : 'adminCellDashboard');
    }
  }, []);

  const handleLoginSuccess = (userRole) => {
    setIsLoggedIn(true);
    setRole(userRole);
    localStorage.setItem('role', userRole);
    setView(userRole === 'admin' ? 'adminDashboard' : 'adminCellDashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole(null);
    setView('landing');
  };

  // 🔹 Admin Dashboard
  if (isLoggedIn && view === 'adminDashboard') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // 🔹 Admin Cell Dashboard
  if (isLoggedIn && view === 'adminCellDashboard') {
    return <AdminCellDashboard onLogout={handleLogout} />;
  }

  // 🔹 Admin Login
  if (view === 'adminLogin') {
    return <AdminLogin onLoginSuccess={() => handleLoginSuccess('admin')} onBack={() => setView('landing')} />;
  }

  // 🔹 Admin Register
  if (view === 'adminRegister') {
    return <AdminRegister onRegisterSuccess={() => setView('adminLogin')} onBack={() => setView('landing')} />;
  }

  // 🔹 Admin Cell Login
  if (view === 'adminCellLogin') {
    return <AdminCellLogin onLoginSuccess={() => handleLoginSuccess('admincell')} onBack={() => setView('landing')} />;
  }

  // 🔹 Admin Cell Register
  if (view === 'adminCellRegister') {
    return <AdminCellRegister onRegisterSuccess={() => setView('adminCellLogin')} onBack={() => setView('landing')} />;
  }

  // 🔹 Default Landing Page
  return (
    <>
    <LandingPage
      onAdminLogin={() => setView('adminLogin')}
      onAdminRegister={() => setView('adminRegister')}
      onAdminCellLogin={() => setView('adminCellLogin')}
      onAdminCellRegister={() => setView('adminCellRegister')}
    />
    <Footer />
    </>
  );
}
