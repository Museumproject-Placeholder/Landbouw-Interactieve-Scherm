import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ContentBlock from './ContentBlock';
import BackButton from '../Common/BackButton';
import { api } from '../../services/api';

const DetailPage = () => {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await api.getContentById(id);
        setContent(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContent();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading content: {error}</p>
          <BackButton />
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Content not found</p>
          <BackButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <BackButton />
        </div>

        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            {content.image && (
              <div className="mb-8">
                <img
                  src={content.image}
                  alt={content.title}
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
              </div>
            )}

            <div className="mb-4">
              <span className="inline-block bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                {content.era}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-display text-gray-800 mb-4">
              {content.title}
            </h1>

            <p className="text-lg text-gray-600 mb-2">{content.dateRange}</p>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              {content.subtitle}
            </p>
          </header>

          <div className="grid gap-8">
            {content.blocks && content.blocks.map((block, index) => (
              <ContentBlock key={index} block={block} />
            ))}
          </div>

          {content.gallery && content.gallery.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-display text-gray-800 mb-6 text-center">
                Gallery
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.gallery.map((image, index) => (
                  <div key={index} className="group cursor-pointer">
                    <img
                      src={image.src}
                      alt={image.caption}
                      className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                    />
                    {image.caption && (
                      <p className="mt-2 text-sm text-gray-600 text-center">
                        {image.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;