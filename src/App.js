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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    if (token && storedRole) {
      setIsLoggedIn(true);
      setView(storedRole === 'admin' ? 'adminDashboard' : 'adminCellDashboard');
    }
  }, []);

  const handleLoginSuccess = (userRole) => {
    setIsLoggedIn(true);
    localStorage.setItem('role', userRole);
    setView(userRole === 'admin' ? 'adminDashboard' : 'adminCellDashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setView('landing');
  };

  if (isLoggedIn && view === 'adminDashboard') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  if (isLoggedIn && view === 'adminCellDashboard') {
    return <AdminCellDashboard onLogout={handleLogout} />;
  }

  if (view === 'adminLogin') {
    return <AdminLogin onLoginSuccess={() => handleLoginSuccess('admin')} onBack={() => setView('landing')} />;
  }

  if (view === 'adminRegister') {
    return <AdminRegister onRegisterSuccess={() => setView('adminLogin')} onBack={() => setView('landing')} />;
  }

  if (view === 'adminCellLogin') {
    return <AdminCellLogin onLoginSuccess={() => handleLoginSuccess('admincell')} onBack={() => setView('landing')} />;
  }

  if (view === 'adminCellRegister') {
    return <AdminCellRegister onRegisterSuccess={() => setView('adminCellLogin')} onBack={() => setView('landing')} />;
  }

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
