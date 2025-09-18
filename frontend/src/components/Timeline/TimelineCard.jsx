import React from 'react';
import { useNavigate } from 'react-router-dom';

const TimelineCard = ({ period, index, isSelected, onSelect }) => {
  const navigate = useNavigate();
  const isEven = index % 2 === 0;

  const handleCardClick = () => {
    onSelect();
    navigate(`/detail/${period.id}`);
  };

  return (
    <div className={`flex items-center ${isEven ? 'justify-start' : 'justify-end'} relative`}>
      <div
        className={`timeline-card max-w-md p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 ${isSelected ? 'ring-2 ring-primary-500' : ''} ${isEven ? 'mr-8' : 'ml-8'}`}
        onClick={handleCardClick}
      >
        <div className="flex items-center mb-3">
          <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {period.era}
          </div>
          <div className="ml-3 text-lg font-semibold text-gray-800">
            {period.title}
          </div>
        </div>

        <div className="text-gray-600 mb-4">
          <p className="text-sm">{period.dateRange}</p>
        </div>

        <div className="text-gray-700 mb-4">
          <p className="line-clamp-3">{period.description}</p>
        </div>

        {period.image && (
          <div className="mb-4">
            <img
              src={period.image}
              alt={period.title}
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {period.tags && period.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
          <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            Learn More →
          </button>
        </div>
      </div>

      <div className={`absolute top-1/2 transform -translate-y-1/2 ${isEven ? 'right-0' : 'left-0'} w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-md`}></div>
    </div>
  );
};

export default TimelineCard;