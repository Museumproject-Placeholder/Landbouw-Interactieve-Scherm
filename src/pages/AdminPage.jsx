import React, { useState } from 'react';
import { Dashboard, ContentEditor } from '../components/Admin';

const AdminPage = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [editingContentId, setEditingContentId] = useState(null);

  const handleEditContent = (contentId) => {
    setEditingContentId(contentId);
    setCurrentView('editor');
  };

  const handleCreateContent = () => {
    setEditingContentId(null);
    setCurrentView('editor');
  };

  const handleSaveContent = () => {
    setCurrentView('dashboard');
    setEditingContentId(null);
  };

  const handleCancelEdit = () => {
    setCurrentView('dashboard');
    setEditingContentId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display text-gray-800">
                Museum Admin Panel
              </h1>
              <p className="text-gray-600 mt-1">
                Manage content and monitor the interactive display system
              </p>
            </div>

            {currentView === 'dashboard' && (
              <button
                onClick={handleCreateContent}
                className="btn-primary"
              >
                Create New Content
              </button>
            )}
          </div>

          {currentView === 'dashboard' && (
            <nav className="mt-6">
              <div className="flex space-x-8">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    currentView === 'dashboard'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('content')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    currentView === 'content'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Content Management
                </button>
                <button
                  onClick={() => setCurrentView('settings')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    currentView === 'settings'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Settings
                </button>
              </div>
            </nav>
          )}
        </div>

        {currentView === 'dashboard' && <Dashboard />}

        {currentView === 'editor' && (
          <ContentEditor
            contentId={editingContentId}
            onSave={handleSaveContent}
            onCancel={handleCancelEdit}
          />
        )}

        {currentView === 'content' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Content Management
              </h3>
              <p className="text-gray-600 mb-6">
                Content management interface will be implemented here.
              </p>
              <button
                onClick={handleCreateContent}
                className="btn-primary"
              >
                Add New Content Item
              </button>
            </div>
          </div>
        )}

        {currentView === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                System Settings
              </h3>
              <p className="text-gray-600 mb-6">
                System configuration options will be available here.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Display Settings</h4>
                  <p className="text-sm text-gray-600">Configure screen timeouts and display preferences</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Data Management</h4>
                  <p className="text-sm text-gray-600">Backup and restore content data</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;