import React, { useState } from 'react';
import { FiSearch, FiShare2, FiUser, FiEdit2, FiTrash2, FiClock, FiDownload, FiEye, FiFile, FiFolder, FiMail, FiPlus } from 'react-icons/fi';

const PersonalSharing = () => {
  // Sample data for personal use
  const [sharedItems, setSharedItems] = useState([
    {
      id: 1,
      name: 'Family Photos',
      type: 'folder',
      sharedWith: [
        { id: 101, name: 'mom@gmail.com', permission: 'view', expiry: '2023-12-31' },
        { id: 102, name: 'dad@gmail.com', permission: 'download', expiry: '' }
      ]
    },
    {
      id: 2,
      name: 'Tax Documents 2022.pdf',
      type: 'document',
      sharedWith: [
        { id: 103, name: 'accountant@example.com', permission: 'download', expiry: '2023-04-15' }
      ]
    },
    {
      id: 3,
      name: 'Personal Recipes',
      type: 'folder',
      sharedWith: [
        { id: 104, name: 'bestfriend@gmail.com', permission: 'view', expiry: '' },
        { id: 105, name: 'sister@gmail.com', permission: 'edit', expiry: '' }
      ]
    }
  ]);

  // Sample contacts for personal use
  const [contacts, setContacts] = useState([
    { id: 101, name: 'mom@gmail.com' },
    { id: 102, name: 'dad@gmail.com' },
    { id: 103, name: 'accountant@example.com' },
    { id: 104, name: 'bestfriend@gmail.com' },
    { id: 105, name: 'sister@gmail.com' },
    { id: 106, name: 'brother@gmail.com' }
  ]);

  // State for modals and filters
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPermission, setFilterPermission] = useState('all');
  const [newEmail, setNewEmail] = useState('');

  // State for sharing form
  const [shareForm, setShareForm] = useState({
    recipients: [],
    permission: 'view',
    expiryDate: '',
    hasExpiry: false
  });

  // State for email form
  const [emailForm, setEmailForm] = useState({
    subject: '',
    message: '',
    item: null
  });

  // Filter shared items
  const filteredItems = sharedItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPermission = filterPermission === 'all' || 
      item.sharedWith.some(share => share.permission === filterPermission);
    
    return matchesSearch && matchesPermission;
  });

  // Handle sharing an item
  const handleShare = () => {
    if (!selectedItem || shareForm.recipients.length === 0) return;
    
    const updatedItems = sharedItems.map(item => {
      if (item.id === selectedItem.id) {
        const newShares = shareForm.recipients.map(recipient => ({
          id: recipient.id,
          name: recipient.name,
          permission: shareForm.permission,
          expiry: shareForm.hasExpiry ? shareForm.expiryDate : ''
        }));
        
        return {
          ...item,
          sharedWith: [...item.sharedWith, ...newShares]
        };
      }
      return item;
    });
    
    setSharedItems(updatedItems);
    setShowShareModal(false);
    resetShareForm();
  };

  // Handle sending email
  const handleSendEmail = () => {
    if (!emailForm.item || !emailForm.subject) return;
    
    // In a real app, you would send the email here
    console.log('Sending email:', {
      to: emailForm.item.sharedWith.map(share => share.name).join(', '),
      subject: emailForm.subject,
      message: emailForm.message,
      item: emailForm.item.name
    });
    
    setShowEmailModal(false);
    setEmailForm({ subject: '', message: '', item: null });
  };

  // Handle revoking access
  const handleRevoke = (itemId, shareId) => {
    const updatedItems = sharedItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          sharedWith: item.sharedWith.filter(share => share.id !== shareId)
        };
      }
      return item;
    });
    setSharedItems(updatedItems);
  };

  // Handle editing permissions
  const handleEditPermission = (itemId, shareId, newPermission) => {
    const updatedItems = sharedItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          sharedWith: item.sharedWith.map(share => 
            share.id === shareId ? { ...share, permission: newPermission } : share
          )
        };
      }
      return item;
    });
    setSharedItems(updatedItems);
  };

  // Add new email to contacts
  const handleAddEmail = () => {
    if (!newEmail || !newEmail.includes('@')) return;
    
    const newContact = {
      id: Math.max(...contacts.map(c => c.id), 0) + 1,
      name: newEmail
    };
    
    setContacts([...contacts, newContact]);
    setNewEmail('');
  };

  // Reset share form
  const resetShareForm = () => {
    setShareForm({
      recipients: [],
      permission: 'view',
      expiryDate: '',
      hasExpiry: false
    });
    setSelectedItem(null);
  };

  // Get permission icon and label
  const getPermissionInfo = (permission) => {
    switch (permission) {
      case 'view': 
        return { icon: <FiEye className="text-blue-500" />, label: 'Can view' };
      case 'edit': 
        return { icon: <FiEdit2 className="text-green-500" />, label: 'Can edit' };
      case 'download': 
        return { icon: <FiDownload className="text-purple-500" />, label: 'Can download' };
      default: 
        return { icon: <FiEye className="text-blue-500" />, label: permission };
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No expiry';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Shared Items</h1>
          <p className="text-gray-600">Manage what you've shared with others</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search shared items..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={filterPermission}
              onChange={(e) => setFilterPermission(e.target.value)}
            >
              <option value="all">All permissions</option>
              <option value="view">View only</option>
              <option value="edit">Can edit</option>
              <option value="download">Can download</option>
            </select>
          </div>
        </div>

        {/* Shared Items List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center">
              <FiFile className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No shared items found</h3>
              <p className="mt-1 text-sm text-gray-500">You haven't shared any items yet or no items match your search.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <li key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {item.type === 'document' ? (
                          <FiFile className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                        ) : (
                          <FiFolder className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                        )}
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {item.name}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowShareModal(true);
                          }}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <FiShare2 className="mr-1" /> Share
                        </button>
                        {item.sharedWith.length > 0 && (
                          <button
                            onClick={() => {
                              setEmailForm({
                                subject: `Shared item: ${item.name}`,
                                message: `I've shared "${item.name}" with you. Here are the details:\n\nPermission: ${item.sharedWith[0].permission}\nExpiry: ${item.sharedWith[0].expiry || 'No expiry'}`,
                                item: item
                              });
                              setShowEmailModal(true);
                            }}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <FiMail className="mr-1" /> Email
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Shared with list */}
                    <div className="mt-2 ml-7">
                      {item.sharedWith.map((share) => {
                        const { icon, label } = getPermissionInfo(share.permission);
                        return (
                          <div key={share.id} className="flex items-center justify-between py-2 text-sm">
                            <div className="flex items-center">
                              <FiUser className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-gray-600">{share.name}</span>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                {icon}
                                <span className="ml-1 text-gray-500">{label}</span>
                              </div>
                              
                              {share.expiry && (
                                <div className="flex items-center text-gray-400">
                                  <FiClock className="h-3 w-3 mr-1" />
                                  <span className="text-xs">Expires {formatDate(share.expiry)}</span>
                                </div>
                              )}
                              
                              <select
                                value={share.permission}
                                onChange={(e) => handleEditPermission(item.id, share.id, e.target.value)}
                                className="text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="view">View</option>
                                <option value="edit">Edit</option>
                                <option value="download">Download</option>
                              </select>
                              
                              <button
                                onClick={() => handleRevoke(item.id, share.id)}
                                className="text-red-500 hover:text-red-700"
                                title="Revoke access"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Share {selectedItem?.type}: {selectedItem?.name}
                </h3>
                
                {/* Add new email */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Add new email</label>
                  <div className="flex">
                    <input
                      type="email"
                      className="flex-grow block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter email address"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <button
                      onClick={handleAddEmail}
                      className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <FiPlus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Recipients */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Share with</label>
                  <select
                    multiple
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-auto min-h-[42px]"
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions)
                        .map(option => contacts.find(contact => contact.id === parseInt(option.value)));
                      setShareForm({ ...shareForm, recipients: selectedOptions });
                    }}
                  >
                    {contacts.map(contact => (
                      <option key={contact.id} value={contact.id}>
                        {contact.name}
                      </option>
                    ))}
                  </select>
                  {shareForm.recipients.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {shareForm.recipients.map(recipient => (
                        <span key={recipient.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {recipient.name}
                          <button
                            type="button"
                            className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
                            onClick={() => {
                              setShareForm({
                                ...shareForm,
                                recipients: shareForm.recipients.filter(r => r.id !== recipient.id)
                              });
                            }}
                          >
                            <svg className="h-3 w-3" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                              <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Permission Level */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Permission Level</label>
                  <select
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={shareForm.permission}
                    onChange={(e) => setShareForm({ ...shareForm, permission: e.target.value })}
                  >
                    <option value="view">View only</option>
                    <option value="edit">Can edit</option>
                    <option value="download">Can download</option>
                  </select>
                </div>
                
                {/* Expiry Date */}
                <div>
                  <div className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id="hasExpiry"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={shareForm.hasExpiry}
                      onChange={(e) => setShareForm({ ...shareForm, hasExpiry: e.target.checked })}
                    />
                    <label htmlFor="hasExpiry" className="ml-2 block text-sm text-gray-700">
                      Set expiry date
                    </label>
                  </div>
                  {shareForm.hasExpiry && (
                    <input
                      type="date"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={shareForm.expiryDate}
                      onChange={(e) => setShareForm({ ...shareForm, expiryDate: e.target.value })}
                    />
                  )}
                </div>
              </div>
              
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleShare}
                >
                  Share
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowShareModal(false);
                    resetShareForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Email Shared Item: {emailForm.item?.name}
                </h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    {emailForm.item?.sharedWith.map(share => (
                      <div key={share.id} className="inline-flex items-center mr-2 mb-1 px-2 py-1 bg-gray-200 rounded">
                        <FiUser className="mr-1 h-3 w-3" />
                        {share.name}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows="4"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={emailForm.message}
                    onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                  />
                </div>
                
                <div className="bg-blue-50 p-3 rounded text-sm">
                  <p className="font-medium">Item Details:</p>
                  <p>Name: {emailForm.item?.name}</p>
                  <p>Type: {emailForm.item?.type}</p>
                  <p>Permissions: {emailForm.item?.sharedWith.map(share => `${share.name} (${share.permission})`).join(', ')}</p>
                </div>
              </div>
              
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSendEmail}
                >
                  Send Email
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowEmailModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalSharing;