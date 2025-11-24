

import React from 'react';
import { LogoIcon } from './icons';
import { Section } from '../types';

interface HeaderProps {
  onSelectSection: (section: Section) => void;
  currentSection: Section;
}

const Header: React.FC<HeaderProps> = ({
  onSelectSection,
  currentSection,
}) => {
  return (
    <header className="bg-blue-700 dark:bg-slate-800 text-white p-4 shadow-md sticky top-0 z-30">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0 cursor-pointer" onClick={() => onSelectSection(Section.HOME)}>
          <LogoIcon className="w-8 h-8 mr-2 text-white" aria-hidden="true" />
          <h1 className="text-2xl font-bold">HSK Pavex</h1>
        </div>
        <nav>
          <button
            onClick={() => onSelectSection(Section.HOME)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300
              ${currentSection === Section.HOME
                ? 'bg-blue-600 text-white shadow-md dark:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-400 dark:bg-slate-700 dark:hover:bg-slate-600'
              }`}
          >
            Trang chủ
          </button>
          <button
            onClick={() => onSelectSection(Section.PRACTICE_HISTORY)}
            className={`ml-4 px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300
              ${currentSection === Section.PRACTICE_HISTORY
                ? 'bg-blue-600 text-white shadow-md dark:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-400 dark:bg-slate-700 dark:hover:bg-slate-600'
              }`}
          >
            Lịch sử luyện tập
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;