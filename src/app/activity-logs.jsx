import React, { useState } from 'react';
import { FiSearch, FiDownload, FiCalendar, FiUser, FiFilter, FiFileText } from 'react-icons/fi';

const ActivityLogs = () => {
  // Sample log data
  const initialLogs = [
    {
      id: 1,
      username: 'john.doe@example.com',
      action: 'Viewed',
      document: 'Q4 Financial Report.pdf',
      timestamp: '2023-05-15T09:30:45Z',
      ipAddress: '192.168.1.45'
    },
    {
      id: 2,
      username: 'jane.smith@example.com',
      action: 'Downloaded',
      document: 'Employee Handbook.docx',
      timestamp: '2023-05-15T10:15:22Z',
      ipAddress: '203.34.56.78'
    },
    {
      id: 3,
      username: 'admin@vaultguard.com',
      action: 'Shared',
      document: 'Project Roadmap.xlsx',
      timestamp: '2023-05-14T14:20:10Z',
      ipAddress: '172.16.0.10'
    },
    {
      id: 4,
      username: 'michael.johnson@example.com',
      action: 'Viewed',
      document: 'Client Contract.pdf',
      timestamp: '2023-05-14T16:45:30Z',
      ipAddress: '192.168.1.102'
    },
    {
      id: 5,
      username: 'sarah.williams@example.com',
      action: 'Downloaded',
      document: 'Marketing Strategy.pdf',
      timestamp: '2023-05-13T11:10:15Z',
      ipAddress: '203.34.56.79'
    },
    {
      id: 6,
      username: 'john.doe@example.com',
      action: 'Viewed',
      document: 'Product Specs.pdf',
      timestamp: '2023-05-12T08:20:33Z',
      ipAddress: '192.168.1.45'
    },
    {
      id: 7,
      username: 'admin@vaultguard.com',
      action: 'Deleted',
      document: 'Old Budget.xlsx',
      timestamp: '2023-05-11T17:30:45Z',
      ipAddress: '172.16.0.10'
    },
  ];

  const [logs, ] = useState(initialLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedAction, setSelectedAction] = useState('All');
  const [selectedUser, setSelectedUser] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 5;

  // Filter logs based on search and filters
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.document.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = 
      (!dateRange.start || new Date(log.timestamp) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(log.timestamp) <= new Date(dateRange.end + 'T23:59:59'));
    
    const matchesAction = selectedAction === 'All' || log.action === selectedAction;
    const matchesUser = selectedUser === 'All' || log.username === selectedUser;
    
    return matchesSearch && matchesDate && matchesAction && matchesUser;
  });

  // Get current logs for pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Username', 'Action', 'Document', 'Timestamp', 'IP Address'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => 
        `"${log.username}","${log.action}","${log.document}","${log.timestamp}","${log.ipAddress}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'vaultguard_activity_logs.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF (mock function - in a real app you'd use a library like jsPDF)
  const exportToPDF = () => {
    alert('PDF export functionality would be implemented here');
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get unique action types for filter dropdown
  const actionTypes = ['All', ...new Set(logs.map(log => log.action))];

  // Get unique users for filter dropdown
  const users = ['All', ...new Set(logs.map(log => log.username))];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Activity Logs</h1>
          <p className="text-gray-600">Monitor all user activities within VaultGuard</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
  {/* Date Range */}
  <div className="col-span-1 sm:col-span-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
      <div className="relative w-full">
        <input
          type="date"
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={dateRange.start}
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
        />
        <FiCalendar className="absolute left-3 top-3 text-gray-400" />
      </div>
      <span className="text-center sm:text-left sm:w-auto">to</span>
      <div className="relative w-full">
        <input
          type="date"
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
        />
        <FiCalendar className="absolute left-3 top-3 text-gray-400" />
      </div>
    </div>
  </div>

  {/* Action Type Filter */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
    <div className="relative">
      <select
        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
        value={selectedAction}
        onChange={(e) => setSelectedAction(e.target.value)}
      >
        {actionTypes.map((action) => (
          <option key={action} value={action}>{action}</option>
        ))}
      </select>
      <FiFilter className="absolute left-3 top-3 text-gray-400" />
    </div>
  </div>

  {/* User Filter */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
    <div className="relative">
      <select
        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        {users.map((user) => (
          <option key={user} value={user}>{user}</option>
        ))}
      </select>
      <FiUser className="absolute left-3 top-3 text-gray-400" />
    </div>
  </div>

  {/* Search */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
    <div className="relative">
      <input
        type="text"
        placeholder="Search by document or user..."
        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <FiSearch className="absolute left-3 top-3 text-gray-400" />
    </div>
  </div>
</div>


          {/* Export Buttons */}
          {/* <div className="flex justify-end space-x-3">
            <button
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FiDownload className="mr-2" /> Export as CSV
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FiFileText className="mr-2" /> Export as PDF
            </button>
          </div> */}
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentLogs.length > 0 ? (
                  currentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {log.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${log.action === 'Viewed' ? 'bg-blue-100 text-blue-800' : 
                            log.action === 'Downloaded' ? 'bg-green-100 text-green-800' :
                            log.action === 'Shared' ? 'bg-purple-100 text-purple-800' :
                            'bg-red-100 text-red-800'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.document}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.ipAddress}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No activity logs found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredLogs.length > logsPerPage && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstLog + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLastLog, filteredLogs.length)}</span> of{' '}
                    <span className="font-medium">{filteredLogs.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      &larr; Previous
                    </button>
                    {Array.from({ length: Math.ceil(filteredLogs.length / logsPerPage) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                          ${currentPage === index + 1 ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage < Math.ceil(filteredLogs.length / logsPerPage) ? currentPage + 1 : currentPage)}
                      disabled={currentPage === Math.ceil(filteredLogs.length / logsPerPage)}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      Next &rarr;
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;