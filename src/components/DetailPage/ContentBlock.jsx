import React from 'react';

const ContentBlock = ({ block }) => {
  const renderContent = () => {
    switch (block.type) {
      case 'text':
        return (
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">{block.content}</p>
          </div>
        );

      case 'image':
        return (
          <div className="text-center">
            <img
              src={block.src}
              alt={block.caption || 'Content image'}
              className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
            />
            {block.caption && (
              <p className="mt-4 text-sm text-gray-600 italic">{block.caption}</p>
            )}
          </div>
        );

      case 'quote':
        return (
          <blockquote className="border-l-4 border-primary-500 pl-6 italic text-lg text-gray-700">
            <p>"{block.content}"</p>
            {block.author && (
              <cite className="block mt-3 text-sm text-gray-600 not-italic">
                — {block.author}
              </cite>
            )}
          </blockquote>
        );

      case 'list':
        return (
          <div>
            {block.title && (
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                {block.title}
              </h4>
            )}
            <ul className="space-y-2">
              {block.items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case 'timeline':
        return (
          <div>
            {block.title && (
              <h4 className="text-xl font-semibold text-gray-800 mb-6">
                {block.title}
              </h4>
            )}
            <div className="space-y-4">
              {block.events.map((event, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-20 text-sm text-primary-600 font-medium">
                    {event.date}
                  </div>
                  <div className="flex-grow pl-4">
                    <h5 className="font-medium text-gray-800">{event.title}</h5>
                    <p className="text-gray-600">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'comparison':
        return (
          <div>
            {block.title && (
              <h4 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                {block.title}
              </h4>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h5 className="font-semibold text-blue-800 mb-3">{block.before.title}</h5>
                <p className="text-blue-700">{block.before.description}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-3">{block.after.title}</h5>
                <p className="text-green-700">{block.after.description}</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-600">Unknown content type: {block.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="content-block animate-fade-in">
      {block.title && block.type !== 'list' && block.type !== 'timeline' && block.type !== 'comparison' && (
        <h3 className="text-2xl font-display text-gray-800 mb-4">
          {block.title}
        </h3>
      )}
      {renderContent()}
    </div>
  );
};

export default ContentBlock;