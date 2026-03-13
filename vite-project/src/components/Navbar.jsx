import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Calendar, CheckSquare } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-8 h-8" />
            <span className="text-xl font-bold">Well_TODO</span>
          </div>

          {user && (
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate('/today')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  isActive('/today')
                    ? 'bg-white text-blue-600 font-semibold'
                    : 'hover:bg-blue-500'
                }`}
              >
                <CheckSquare className="w-5 h-5" />
                Today
              </button>

              <button
                onClick={() => navigate('/history')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  isActive('/history')
                    ? 'bg-white text-blue-600 font-semibold'
                    : 'hover:bg-blue-500'
                }`}
              >
                <Calendar className="w-5 h-5" />
                History
              </button>

              <div className="flex items-center gap-3 pl-6 border-l border-blue-400">
                <div className="text-right">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-blue-100">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-blue-500 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
