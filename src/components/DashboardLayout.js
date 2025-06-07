"use client"

import { useState, useEffect } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  FaUserCircle,
  FaBars,
  FaChartPie,
  FaUpload,
  FaUsers,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaBell,
} from "react-icons/fa"

const dashboardLinks = [{ to: "/dashboard/Dashboard", label: "Dashboard", icon: <FaChartPie className="h-5 w-5" /> }]

const applicationLinks = [
  { to: "/dashboard/UploadPage", label: "Upload Files", icon: <FaUpload className="h-5 w-5" /> },
  { to: "/dashboard/SharingCollaboration", label: "Sharing & Collaboration", icon: <FaUsers className="h-5 w-5" /> },
  { to: "/dashboard/ActivityLogs", label: "Activity Logs", icon: <FaHistory className="h-5 w-5" /> },
  { to: "/dashboard/Settings", label: "Settings", icon: <FaCog className="h-5 w-5" /> },
]

const DashboardLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    navigate("/")
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed z-30 inset-y-0 left-0 w-72 bg-white shadow-lg border-r border-gray-100
          transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          transition-all duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:flex-shrink-0
        `}
      >
        {/* Logo and Brand */}
        <div className="flex items-center justify-center h-16 px-6 border-b border-gray-100">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            VaultGuard
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col h-[calc(100%-4rem)]">
          {/* User Profile */}
          <div className="flex flex-col items-center py-6 border-b border-gray-100">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                <FaUserCircle className="text-white text-5xl" />
              </div>
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="mt-3 text-lg font-semibold text-gray-800">John Doe</div>
            <div className="text-sm text-gray-500">Administrator</div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            {/* Dashboards Section */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">Dashboards</div>
              <ul className="space-y-1">
                {dashboardLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        location.pathname === link.to
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className={`${location.pathname === link.to ? "text-blue-600" : "text-gray-400"}`}>
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Application Views Section */}
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
                Application Views
              </div>
              <ul className="space-y-1">
                {applicationLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        location.pathname === link.to
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className={`${location.pathname === link.to ? "text-blue-600" : "text-gray-400"}`}>
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 shadow-sm"
            >
              <FaSignOutAlt className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            {/* Left: Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Open sidebar"
            >
              <FaBars className="h-5 w-5" />
            </button>

            {/* Center: Date and Time */}
            <div className="hidden md:block text-center">
              <div className="text-sm font-medium text-gray-500">{formatDate(currentTime)}</div>
              <div className="text-lg font-semibold text-gray-800">{formatTime(currentTime)}</div>
            </div>

            {/* Right: Search and Notifications */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaSearch className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="py-2 pl-10 pr-4 w-64 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search..."
                />
              </div>

              {/* Notifications */}
              <button className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 relative">
                <FaBell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile (Mobile) */}
              <div className="lg:hidden">
                <button className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                  <FaUserCircle className="w-6 h-6 text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
