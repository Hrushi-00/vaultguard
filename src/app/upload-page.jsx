"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Link } from "react-router-dom"
import { useDropzone } from 'react-dropzone'
import {
  FaUpload,
  FaSearch,
  FaTrash,
  FaDownload,
  FaEdit,
  FaTimes,
  FaCheck,
  FaSpinner,
  FaImage,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaCompress,
  FaFileAudio,
  FaFileVideo,
  FaFile,
} from "react-icons/fa"

export default function UploadPage() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [uploadingFile, setUploadingFile] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newName, setNewName] = useState("")
  const fileInputRef = useRef(null)

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:4000/api/documents", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) throw new Error("Failed to fetch documents")
      const data = await response.json()
      setDocuments(data)
    } catch (error) {
      console.error("Error fetching documents:", error)
      alert("Failed to load documents")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      if (!searchQuery.trim()) {
        return fetchDocuments()
      }

      const response = await fetch(`http://localhost:4000/api/documents/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) throw new Error("Search failed")
      const data = await response.json()
      setDocuments(data)
    } catch (error) {
      console.error("Search error:", error)
      alert("Search failed")
    } finally {
      setLoading(false)
    }
  }

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles.length) return;

    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setUploadingFile(true);
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to upload documents');
      }

      const response = await fetch('http://localhost:4000/api/documents/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      // Refresh document list
      fetchDocuments();
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message);
    } finally {
      setUploadingFile(false);
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
    maxSize: 10 * 1024 * 1024 // 10MB limit
  });

  const handleDownload = async (doc) => {
    try {
      // Check if we have a valid document
      if (!doc || !doc._id || !doc.url) {
        throw new Error('Invalid document');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to download documents');
        return;
      }

      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = doc.url;
      link.download = doc.name;
      link.target = '_self'; // Download in current tab
      link.rel = 'noopener noreferrer';
      
      // Create a blob from the response
      const response = await fetch(doc.url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Set the link to use the blob URL
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert(error.message);
    }
  }

  const handleDelete = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Are you sure you want to delete this document?")) return

    try {
      const response = await fetch(`http://localhost:4000/api/documents/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) throw new Error("Delete failed")

      // Remove from state
      setDocuments(documents.filter((doc) => doc._id !== id))
    } catch (error) {
      console.error("Delete error:", error)
      alert("Delete failed")
    }
  }

  const startRename = (doc) => {
    setEditingId(doc._id)
    setNewName(doc.name)
  }

  const cancelRename = () => {
    setEditingId(null)
    setNewName("")
  }

const completeRename = async (id) => {
  if (!newName.trim()) {
    return cancelRename()
  }

  try {
    const response = await fetch(`http://localhost:4000/api/documents/rename/${id}`, {  // Changed from /:id/rename to /rename/:id
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ name: newName }),
    })

    if (!response.ok) throw new Error("Rename failed")

    // Update in state
    setDocuments(documents.map((doc) => (doc._id === id ? { ...doc, name: newName } : doc)))

    cancelRename()
  } catch (error) {
    console.error("Rename error:", error)
    alert("Rename failed")
  }
}

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type) => {
    if (type.includes("image")) return <FaImage className="h-6 w-6" />
    if (type.includes("pdf")) return <FaFilePdf className="h-6 w-6 text-red-600" />
    if (type.includes("word") || type.includes("document")) return <FaFileWord className="h-6 w-6 text-blue-600" />
    if (type.includes("sheet") || type.includes("excel")) return <FaFileExcel className="h-6 w-6 text-green-600" />
    if (type.includes("presentation") || type.includes("powerpoint")) return <FaFilePowerpoint className="h-6 w-6 text-orange-600" />
    if (type.includes("zip") || type.includes("compressed")) return <FaCompress className="h-6 w-6" />
    if (type.includes("audio")) return <FaFileAudio className="h-6 w-6 text-purple-600" />
    if (type.includes("video")) return <FaFileVideo className="h-6 w-6 text-red-600" />
    return <FaFile className="h-6 w-6 text-gray-600" />
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Page Header */}
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Upload Files</h1>
          <Link to="/dashboard/Dashboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Search and Upload Section */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    fetchDocuments()
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Upload Button */}
            <div {...getRootProps()} className={`border-2 border-dashed p-6 text-center rounded-lg cursor-pointer ${isDragActive ? 'bg-blue-100' : 'bg-white'}`}>
              <input {...getInputProps()} />
              <FaUpload className="mx-auto text-gray-400" size={32} />
              <p className="mt-2 text-sm">Drag & drop or click to upload (Max 10MB)</p>
              {uploadingFile && (
                <div className="mt-4">
                  <FaSpinner className="animate-spin mr-2 inline-block" />
                  Uploading...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document List Section */}
      <div className="px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-indigo-600 h-10 w-10" />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchQuery ? "No documents match your search" : "No documents uploaded yet"}
          </div>
        ) : (
          <div className="mt-8">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Document Name
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Size
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Uploaded
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {documents.map((doc) => (
                        <tr key={doc._id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                <span className="text-xl">{getFileIcon(doc.type)}</span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{doc.name}</div>
                                <div className="text-gray-500">{doc.type}</div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatFileSize(doc.size)}
                            <br />
                            <span className="text-xs text-gray-400">{doc.size} bytes</span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatDate(doc.uploadedAt)}
                            <br />
                            <span className="text-xs text-gray-400">{formatTime(doc.uploadedAt)}</span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            {editingId === doc._id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={newName}
                                  onChange={(e) => setNewName(e.target.value)}
                                  className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  onKeyDown={(e) => e.key === "Enter" && completeRename(doc._id)}
                                />
                                <button
                                  onClick={() => completeRename(doc._id)}
                                  className="text-indigo-600 hover:text-indigo-500"
                                >
                                  <FaCheck className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={cancelRename}
                                  className="text-red-600 hover:text-red-500"
                                >
                                  <FaTimes className="h-5 w-5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-4">
                                <button
                                  onClick={() => handleDownload(doc)}
                                  className="text-indigo-600 hover:text-indigo-500"
                                >
                                  <FaDownload className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => startRename(doc)}
                                  className="text-indigo-600 hover:text-indigo-500"
                                >
                                  <FaEdit className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(doc._id)}
                                  className="text-red-600 hover:text-red-500"
                                >
                                  <FaTrash className="h-5 w-5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

  )
}

