
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Section } from '../types';
import { HSK_LEVELS } from '../hsk-levels';
import { BookOpenIcon, BrainIcon, SparklesIcon, TypeIcon } from './icons'; 

interface HomePageProps {
  onSelectSection: (section: Section) => void;
  onSelectHSKLevel: (level: string) => void;
}

const practiceModules = [
  {
    id: Section.HANDWRITING_PRACTICE,
    title: 'Ghi nhớ chép chính tả',
    description: 'Luyện viết chữ Hán để cải thiện trí nhớ và độ chính xác.',
    icon: <TypeIcon className="w-12 h-12 text-indigo-500" />,
    color: 'indigo',
  },
  {
    id: Section.VOCABULARY_PRACTICE,
    title: 'Luyện từ vựng',
    description: 'Củng cố vốn từ qua flashcards, quizzes, ghép từ và nhiều hơn nữa.',
    icon: <BrainIcon className="w-12 h-12 text-green-500" />,
    color: 'green',
  },
  {
    id: Section.READING_TRANSLATION_PRACTICE,
    title: 'Luyện Đọc - Dịch (Thử nghiệm)',
    description: 'Nâng cao kỹ năng đọc hiểu và dịch thuật qua các bài đọc theo cấp độ.',
    icon: <BookOpenIcon className="w-12 h-12 text-orange-500" />,
    color: 'orange',
  },
];

const HomePage: React.FC<HomePageProps> = ({ onSelectSection, onSelectHSKLevel }) => {
  const [activeDropdown, setActiveDropdown] = useState<Section | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownToggle = (sectionId: Section) => {
    setActiveDropdown(prev => (prev === sectionId ? null : sectionId));
  };

  const handleLevelSelect = (level: string, sectionId: Section) => {
    onSelectHSKLevel(level);
    onSelectSection(sectionId);
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

  const buttonColorClasses: { [key: string]: string } = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    orange: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500',
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-800 dark:text-blue-200 mb-4 flex items-center justify-center gap-3">
          <SparklesIcon className="w-10 h-10 text-yellow-400" />
          Chào mừng đến với HSK Pavex!
        </h2>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Nền tảng toàn diện giúp bạn chinh phục kỳ thi HSK 3.0 mới với 9 cấp độ. Luyện tập các kỹ năng Nghe, Nói, Đọc, Viết, và Dịch một cách hiệu quả.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8" ref={dropdownRef}>
        {practiceModules.map((module) => (
          <div key={module.id} className="relative bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center">
            {module.icon}
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4 mb-2">{module.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">{module.description}</p>
            <button
              onClick={() => handleDropdownToggle(module.id)}
              className={`w-full text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 shadow-md focus:outline-none focus:ring-4 ${buttonColorClasses[module.color]}`}
              aria-haspopup="true"
              aria-expanded={activeDropdown === module.id}
            >
              Bắt đầu Luyện tập
            </button>
            {activeDropdown === module.id && (
              <div
                className="absolute top-full mt-2 w-56 bg-white dark:bg-slate-700 rounded-md shadow-lg z-20 max-h-64 overflow-y-auto ring-1 ring-black ring-opacity-5"
                role="menu"
              >
                <div className="py-1">
                  {HSK_LEVELS.map((hsk) => (
                    <button
                      key={hsk.level}
                      onClick={() => handleLevelSelect(hsk.level, module.id)}
                      className="block w-full text-left px-4 py-2 text-md transition-colors duration-200 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600 disabled:opacity-50"
                      role="menuitem"
                      disabled={hsk.words.length === 0}
                    >
                      {hsk.label}
                      {hsk.words.length === 0 && <span className="ml-2 text-xs opacity-70">(Chưa có)</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
