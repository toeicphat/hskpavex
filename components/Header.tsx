

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LogoIcon } from './icons';
import { HSK_LEVELS } from '../hsk-levels';
import { Section } from '../types';

interface HeaderProps {
  onSelectSection: (section: Section) => void;
  onSelectHSKLevel: (level: string) => void;
  currentSection: Section;
  currentHSKLevel: string;
}

const Header: React.FC<HeaderProps> = ({
  onSelectSection,
  onSelectHSKLevel,
  currentSection,
  currentHSKLevel,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<Section | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sections = [
    { id: Section.HOME, label: 'Trang chủ' },
    { id: Section.HANDWRITING_PRACTICE, label: 'Ghi nhớ chép chính tả' },
    { id: Section.VOCABULARY_PRACTICE, label: 'Luyện từ vựng' },
    { id: Section.READING_TRANSLATION_PRACTICE, label: 'Luyện Đọc - Dịch' },
  ];

  const handleDropdownToggle = (section: Section) => {
    if (section === Section.HOME) {
      onSelectSection(Section.HOME);
      setActiveDropdown(null);
    } else {
      setActiveDropdown(prev => (prev === section ? null : section));
    }
  };

  const handleHSKLevelSelect = (level: string, section: Section) => {
    onSelectHSKLevel(level);
    onSelectSection(section);
    setActiveDropdown(null);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setActiveDropdown(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const isPracticeSection = (sectionId: Section) => {
    return [
      Section.HANDWRITING_PRACTICE,
      Section.VOCABULARY_PRACTICE,
      Section.READING_TRANSLATION_PRACTICE,
    ].includes(sectionId);
  };

  return (
    <header className="bg-blue-700 dark:bg-slate-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <LogoIcon className="w-8 h-8 mr-2 text-white" aria-hidden="true" />
          <h1 className="text-2xl font-bold">HSK Pavex</h1>
        </div>
        <nav className="relative flex justify-center flex-grow" ref={dropdownRef}>
          {sections.map((section) => (
            <div key={section.id} className="relative mx-2">
              <button
                onClick={() => handleDropdownToggle(section.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300
                  ${currentSection === section.id
                    ? 'bg-blue-600 text-white shadow-md dark:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-400 dark:bg-slate-700 dark:hover:bg-slate-600'
                  }`}
                aria-haspopup={isPracticeSection(section.id) ? "true" : undefined}
                aria-expanded={activeDropdown === section.id}
              >
                {section.label}
              </button>
              {isPracticeSection(section.id) && activeDropdown === section.id && (
                <div
                  className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby={`menu-button-${section.id}`}
                >
                  <div className="py-1">
                    {HSK_LEVELS.map((hsk) => (
                      <button
                        key={hsk.level}
                        onClick={() => handleHSKLevelSelect(hsk.level, section.id)}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200
                          ${currentHSKLevel === hsk.level && currentSection === section.id
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 font-semibold'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600'
                          }`}
                        role="menuitem"
                        disabled={hsk.words.length === 0}
                      >
                        {hsk.label}
                        {hsk.words.length === 0 && <span className="ml-1 text-xs opacity-70">(Chưa có)</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
