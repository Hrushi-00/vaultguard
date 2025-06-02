import React, { useState, useCallback } from 'react';
import { FiUpload, FiFile, FiDownload, FiTrash2, FiEdit2, FiX, FiClock, FiHardDrive } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';

const DocumentManagement = () => {
  // Sample document data
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Tax_Return_2022.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadDate: '2023-03-15T09:30:45Z',
      editing: false
    },
    {
      id: 2,
      name: 'Passport_Scan.jpg',
      type: 'image',
      size: '1.8 MB',
      uploadDate: '2023-02-28T14:20:10Z',
      editing: false
    },
    {
      id: 3,
      name: 'Medical_Records.pdf',
      type: 'pdf',
      size: '5.2 MB',
      uploadDate: '2023-04-05T11:15:22Z',
      editing: false
    },
    {
      id: 4,
      name: 'House_Lease.docx',
      type: 'document',
      size: '0.8 MB',
      uploadDate: '2023-01-10T16:45:30Z',
      editing: false
    },
  ]);

  // State for uploads
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'uploadDate', direction: 'desc' });

  // Handle file upload
  const onDrop = useCallback((acceptedFiles) => {
    setUploadError(null);
    setUploadProgress(0);
    
    // Simulate upload progress
    const totalFiles = acceptedFiles.length;
    let filesProcessed = 0;
    
    acceptedFiles.forEach((file) => {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + (100 / (totalFiles * 10));
          if (newProgress >= ((filesProcessed + 1) / totalFiles) * 100) {
            clearInterval(interval);
            filesProcessed++;
            
            // Add the file to documents when "upload" completes
            if (filesProcessed === totalFiles) {
              const newDocuments = acceptedFiles.map((f, index) => ({
                id: documents.length + index + 1,
                name: f.name,
                type: f.type.split('/')[0] || 'file',
                size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
                uploadDate: new Date().toISOString(),
                editing: false
              }));
              
              setDocuments(prev => [...prev, ...newDocuments]);
              setUploadProgress(null);
            }
            return newProgress;
          }
          return newProgress;
        });
      }, 100);
    });
  }, [documents.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  // Handle document download
  const handleDownload = (id) => {
    // In a real app, this would download the actual file
    alert(`Downloading document ${id}`);
  };

  // Handle document delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  // Toggle edit mode
  const toggleEdit = (id) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, editing: !doc.editing } : doc
    ));
  };

  // Handle rename
  const handleRename = (id, newName) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, name: newName, editing: false } : doc
    ));
  };

  // Handle sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting
  const sortedDocuments = React.useMemo(() => {
    let sortableItems = [...documents];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === 'name') {
          return sortConfig.direction === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (sortConfig.key === 'size') {
          const sizeA = parseFloat(a.size);
          const sizeB = parseFloat(b.size);
          return sortConfig.direction === 'asc' 
            ? sizeA - sizeB
            : sizeB - sizeA;
        } else { // uploadDate
          return sortConfig.direction === 'asc' 
            ? new Date(a.uploadDate) - new Date(b.uploadDate)
            : new Date(b.uploadDate) - new Date(a.uploadDate);
        }
      });
    }
    return sortableItems;
  }, [documents, sortConfig]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FiFile className="text-red-500" />;
      case 'image':
        return <FiFile className="text-blue-500" />;
      case 'document':
        return <FiFile className="text-green-500" />;
      default:
        return <FiFile className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Documents</h1>
          <p className="text-gray-600">Manage your personal documents securely</p>
        </div>

        {/* Upload Area */}
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-6 mb-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2">
            <FiUpload className="h-10 w-10 text-gray-400" />
            <p className="text-sm text-gray-600">
              {isDragActive ? (
                'Drop your files here'
              ) : (
                <>
                  Drag & drop files here, or <span className="text-blue-600">click to browse</span>
                </>
              )}
            </p>
            <p className="text-xs text-gray-500">PDF, JPG, PNG, DOCX up to 10MB</p>
          </div>
        </div>

        {/* Upload Progress */}
        {uploadProgress !== null && (
          <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                Uploading {Math.floor(uploadProgress)}% complete
              </span>
              <span className="text-xs text-gray-500">
                {Math.floor(uploadProgress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Upload Error */}
        {uploadError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiX className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{uploadError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Documents Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {sortConfig.key === 'name' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('uploadDate')}
                  >
                    <div className="flex items-center">
                      <FiClock className="mr-1" />
                      Uploaded
                      {sortConfig.key === 'uploadDate' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('size')}
                  >
                    <div className="flex items-center">
                      <FiHardDrive className="mr-1" />
                      Size
                      {sortConfig.key === 'size' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedDocuments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No documents found. Upload your first document!
                    </td>
                  </tr>
                ) : (
                  sortedDocuments.map((document) => (
                    <tr key={document.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {getFileIcon(document.type)}
                          </div>
                          <div className="ml-4">
                            {document.editing ? (
                              <div className="flex items-center">
                                <input
                                  type="text"
                                  defaultValue={document.name}
                                  className="border border-gray-300 rounded px-2 py-1 text-sm w-64"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleRename(document.id, e.target.value);
                                    } else if (e.key === 'Escape') {
                                      toggleEdit(document.id);
                                    }
                                  }}
                                  onBlur={(e) => handleRename(document.id, e.target.value)}
                                  autoFocus
                                />
                                <button
                                  onClick={() => toggleEdit(document.id)}
                                  className="ml-2 text-gray-500 hover:text-gray-700"
                                >
                                  <FiX />
                                </button>
                              </div>
                            ) : (
                              <div className="text-sm font-medium text-gray-900">
                                {document.name}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(document.uploadDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {document.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-4">
                          <button
                            onClick={() => handleDownload(document.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Download"
                          >
                            <FiDownload />
                          </button>
                          <button
                            onClick={() => toggleEdit(document.id)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Rename"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(document.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentManagement;