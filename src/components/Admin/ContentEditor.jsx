import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const ContentEditor = ({ contentId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    era: '',
    dateRange: '',
    subtitle: '',
    description: '',
    image: '',
    tags: [],
    blocks: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (contentId) {
      const fetchContent = async () => {
        try {
          setLoading(true);
          const response = await api.getContentById(contentId);
          setFormData(response.data);
        } catch (error) {
          console.error('Error fetching content:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchContent();
    }
  }, [contentId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagsChange = (value) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const addContentBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type,
      title: '',
      content: '',
      ...(type === 'image' && { src: '', caption: '' }),
      ...(type === 'list' && { items: [] }),
      ...(type === 'timeline' && { events: [] })
    };

    setFormData(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
  };

  const updateContentBlock = (blockId, updates) => {
    setFormData(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === blockId ? { ...block, ...updates } : block
      )
    }));
  };

  const removeContentBlock = (blockId) => {
    setFormData(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (contentId) {
        await api.updateContent(contentId, formData);
      } else {
        await api.createContent(formData);
      }
      onSave && onSave();
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display text-gray-800">
            {contentId ? 'Edit Content' : 'Create New Content'}
          </h2>
          <div className="space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="content-form"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <form id="content-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Era *
              </label>
              <input
                type="text"
                value={formData.era}
                onChange={(e) => handleInputChange('era', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range *
              </label>
              <input
                type="text"
                value={formData.dateRange}
                onChange={(e) => handleInputChange('dateRange', e.target.value)}
                placeholder="e.g., 1800-1850"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Image URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="agriculture, innovation, tools"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Content Blocks
              </label>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => addContentBlock('text')}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  + Text
                </button>
                <button
                  type="button"
                  onClick={() => addContentBlock('image')}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                >
                  + Image
                </button>
                <button
                  type="button"
                  onClick={() => addContentBlock('list')}
                  className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                >
                  + List
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {formData.blocks.map((block) => (
                <div key={block.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {block.type} Block
                    </span>
                    <button
                      type="button"
                      onClick={() => removeContentBlock(block.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  {block.type === 'text' && (
                    <div>
                      <input
                        type="text"
                        placeholder="Block title (optional)"
                        value={block.title}
                        onChange={(e) => updateContentBlock(block.id, { title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                      />
                      <textarea
                        placeholder="Content text..."
                        value={block.content}
                        onChange={(e) => updateContentBlock(block.id, { content: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  )}

                  {block.type === 'image' && (
                    <div>
                      <input
                        type="url"
                        placeholder="Image URL"
                        value={block.src || ''}
                        onChange={(e) => updateContentBlock(block.id, { src: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                      />
                      <input
                        type="text"
                        placeholder="Image caption (optional)"
                        value={block.caption || ''}
                        onChange={(e) => updateContentBlock(block.id, { caption: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentEditor;