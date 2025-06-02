import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaCar, FaBars } from 'react-icons/fa';

const dashboardLinks = [
  { to: '/dashboard/Dashboard', label: 'Dashboard', icon: <FaUserCircle /> },
];

const applicationLinks = [
  { to: '/dashboard/UploadPage', label: 'Upload Page', icon: <FaCar /> },


  { to: '/dashboard/SharingCollaboration', label: 'Sharing Collaboration', icon: <FaCar /> },
  { to: '/dashboard/ActivityLogs', label: 'Activity Logs', icon: <FaCar /> },
  { to: '/dashboard/Settings', label: 'Settings', icon: <FaCar /> },

];

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem('isAuthenticated');
    // Redirect to login page
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Open sidebar"
      >
        <FaBars className="text-2xl text-blue-600" />
      </button>
      {/* Sidebar */}
      <aside
        className={`
          fixed z-40 inset-y-0 left-0 w-64 bg-white border-r border-gray-200 px-4 py-6
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-200 ease-in-out
          md:static md:translate-x-0 md:flex-shrink-0
        `}
        style={{ minHeight: '100vh' }}
      >
        {/* Logo or Brand */}
        <div className="text-2xl font-bold text-blue-600 mb-8 text-center">
          VaultGuard
        </div>
        {/* User Profile */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <FaUserCircle className="text-blue-500 text-4xl" />
          </div>
          <div className="text-lg font-semibold text-gray-800">Name</div>
          
        </div>
        {/* Dashboards Section */}
        <div className="mb-4">
          <div className="text-xs text-gray-400 uppercase px-3 mb-2">Dashboards</div>
          <ul className="space-y-1">
            {dashboardLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    location.pathname === link.to
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </Link>
             
              </li>
              
            ))}
          </ul>
        </div>
        {/* Application Views Section */}
        <div>
          <div className="text-xs text-gray-400 uppercase px-3 mb-2">Application Views</div>
          <ul className="space-y-1">
            {applicationLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    location.pathname === link.to
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
               <button
            onClick={handleLogout}
            className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
          >
            Logout
          </button>
          </ul>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-4 md:p-8 overflow-y-auto h-screen">
        <Outlet />
        
      </main>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
        
      )}
    </div>
  );
};

export default DashboardLayout;