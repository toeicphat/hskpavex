import React from 'react';
import { HSK_LEVELS } from '../hsk-levels'; // Updated import path

interface HSKLevelSelectorProps {
  onSelectHSKLevel: (level: string) => void;
  currentHSKLevel: string;
}

const HSKLevelSelector: React.FC<HSKLevelSelectorProps> = ({ onSelectHSKLevel, currentHSKLevel }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {HSK_LEVELS.map((hsk) => (
        <button
          key={hsk.level}
          onClick={() => onSelectHSKLevel(hsk.level)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            currentHSKLevel === hsk.level
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-blue-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
          // disabled={hsk.words.length === 0} // Re-enable all levels, disable if no words exist
        >
          {hsk.label}
          {hsk.words.length === 0 && <span className="ml-1 text-xs opacity-70">(Chưa có)</span>}
        </button>
      ))}
    </div>
  );
};

export default HSKLevelSelector;