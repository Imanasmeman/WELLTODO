import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import TodayBoard from './pages/TodayBoard.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import { TaskProvider } from './context/TaskContext.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      {user ? (
        <TaskProvider>
          <div className="min-h-screen bg-gray-100">
            <Navbar user={user} onLogout={() => setUser(null)} />
            <Routes>
              <Route path="/today" element={<TodayBoard />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="*" element={<Navigate to="/today" replace />} />
            </Routes>
          </div>
        </TaskProvider>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={setUser} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
