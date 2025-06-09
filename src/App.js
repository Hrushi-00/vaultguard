// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/Auth';
import DashboardLayout from './components/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './app/dashboard';
import UploadPage from './app/upload-page';
import ActivityLogs from './app/activity-logs';
import SharingCollaboration from './app/sharing-collaboration';
import Settings from './app/settings';
import ResetPassword from './app/reset-password';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route
          path="Dashboard"
          element={<PrivateRoute><DashboardLayout /></PrivateRoute>}
        >
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="UploadPage" element={<UploadPage />} />
          <Route path="ActivityLogs" element={<ActivityLogs />} />
          <Route path="SharingCollaboration" element={<SharingCollaboration />} />
          
          <Route path="Settings" element={<Settings />} />
          <Route path="reset-password/:resetToken" element={<ResetPassword />} />
          {/* Add other dashboard routes here */}

        </Route>
      </Routes>
    </Router>
  );
}

export default App;