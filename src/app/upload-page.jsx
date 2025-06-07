// 📁 DocumentManagement.jsx (React Frontend Integrated with Node.js API)
import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { FiUpload, FiFile, FiDownload, FiTrash2, FiEdit2,  } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';

const API_BASE = 'http://localhost:4000/api/documents';

const DocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'uploadDate', direction: 'desc' });

  const fetchDocuments = async () => {
    try {
      const res = await axios.get(`${API_BASE}`);
      setDocuments(res.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploadError(null);
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    try {
      setUploadProgress(0);
      const res = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });
      setDocuments((prev) => [...prev, res.data]);
      setUploadProgress(null);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Upload failed. Please try again.');
      setUploadProgress(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024
  });

  const handleDownload = (url) => {
    window.open(url, '_blank');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await axios.delete(`${API_BASE}/${id}`);
        setDocuments((prev) => prev.filter(doc => doc._id !== id));
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const toggleEdit = (id) => {
    setDocuments(documents.map(doc =>
      doc._id === id ? { ...doc, editing: !doc.editing } : doc
    ));
  };

  const handleRename = async (id, newName) => {
    try {
      const res = await axios.put(`${API_BASE}/rename/${id}`, { name: newName });
      setDocuments(docs => docs.map(doc => doc._id === id ? { ...doc, name: res.data.name, editing: false } : doc));
    } catch (error) {
      console.error('Rename error:', error);
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedDocuments = React.useMemo(() => {
    let sortableItems = [...documents];
    if (sortConfig.key === 'name') {
      sortableItems.sort((a, b) =>
        sortConfig.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      );
    } else if (sortConfig.key === 'size') {
      sortableItems.sort((a, b) =>
        sortConfig.direction === 'asc' ? parseFloat(a.size) - parseFloat(b.size) : parseFloat(b.size) - parseFloat(a.size)
      );
    } else {
      sortableItems.sort((a, b) =>
        sortConfig.direction === 'asc' ? new Date(a.uploadDate) - new Date(b.uploadDate) : new Date(b.uploadDate) - new Date(a.uploadDate)
      );
    }
    return sortableItems;
  }, [documents, sortConfig]);

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  const getFileIcon = (type) => <FiFile className={"text-blue-500"} />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">My Documents</h1>

        <div {...getRootProps()} className={`border-2 border-dashed p-6 text-center rounded-lg cursor-pointer ${isDragActive ? 'bg-blue-100' : 'bg-white'}`}>
          <input {...getInputProps()} />
          <FiUpload className="mx-auto text-gray-400" size={32} />
          <p className="mt-2 text-sm">Drag & drop or click to upload (Max 10MB)</p>
        </div>

        {uploadProgress !== null && (
          <div className="mt-4">
            Upload Progress: {uploadProgress}%
            <div className="h-2 bg-gray-200 rounded">
              <div className="h-2 bg-blue-600 rounded" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          </div>
        )}

        {uploadError && <p className="mt-2 text-red-500">{uploadError}</p>}

        <div className="mt-6">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="text-left text-sm font-semibold text-gray-700">
                <th className="p-3 cursor-pointer" onClick={() => requestSort('name')}>Name</th>
                <th className="p-3 cursor-pointer" onClick={() => requestSort('uploadDate')}>Date</th>
                <th className="p-3 cursor-pointer" onClick={() => requestSort('size')}>Size</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedDocuments.map(doc => (
                <tr key={doc._id} className="hover:bg-gray-100">
                  <td className="p-3 flex items-center">
                    {getFileIcon(doc.type)}
                    {doc.editing ? (
                      <input
                        defaultValue={doc.name}
                        className="ml-2 border px-1 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRename(doc._id, e.target.value);
                          else if (e.key === 'Escape') toggleEdit(doc._id);
                        }}
                        onBlur={(e) => handleRename(doc._id, e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <span className="ml-2 text-sm">{doc.name}</span>
                    )}
                  </td>
                  <td className="p-3 text-sm">{formatDate(doc.uploadDate)}</td>
                  <td className="p-3 text-sm">{doc.size}</td>
                  <td className="p-3 flex space-x-2 text-sm">
                    <button onClick={() => handleDownload(doc.url)} className="text-blue-600"><FiDownload /></button>
                    <button onClick={() => toggleEdit(doc._id)} className="text-yellow-600"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(doc._id)} className="text-red-600"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
              {sortedDocuments.length === 0 && (
                <tr><td colSpan="4" className="text-center p-4 text-sm text-gray-500">No documents uploaded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DocumentManagement;
