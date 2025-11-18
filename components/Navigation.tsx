
import React from 'react';
import { Section } from '../types';
import { HSK_LEVELS } from '../hsk-levels'; // Updated import path

interface NavigationProps {
  onSelectSection: (section: Section) => void;
  onSelectHSKLevel: (level: string) => void;
  currentSection: Section;
  currentHSKLevel: string;
}

const Navigation: React.FC<NavigationProps> = ({
  onSelectSection,
  onSelectHSKLevel,
  currentSection,
  currentHSKLevel,
}) => {
  const sections = [
    { id: Section.HANDWRITING_PRACTICE, label: 'Ghi nhớ chép chính tả' },
    { id: Section.VOCABULARY_PRACTICE, label: 'Luyện từ vựng' },
  ];

  return (
    <nav className="bg-blue-50 dark:bg-slate-950 shadow-lg py-3 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        {/* Main Sections Navigation */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                currentSection === section.id
                  ? 'bg-blue-600 text-white shadow-md dark:bg-blue-700'
                  : 'bg-blue-200 text-blue-800 hover:bg-blue-300 dark:bg-slate-700 dark:text-gray-100 dark:hover:bg-slate-600'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* HSK Level Navigation */}
        <div className="flex flex-wrap justify-center gap-2">
          {HSK_LEVELS.map((hsk) => (
            <button
              key={hsk.level}
              onClick={() => onSelectHSKLevel(hsk.level)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors duration-200 ${
                currentHSKLevel === hsk.level
                  ? 'bg-blue-600 text-white shadow-sm dark:bg-blue-700'
                  : 'bg-blue-200 text-blue-800 hover:bg-blue-300 dark:bg-slate-700 dark:text-gray-100 dark:hover:bg-slate-600'
              }`}
            >
              {hsk.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;