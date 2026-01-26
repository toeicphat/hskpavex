
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Section } from '../types';
import { HSK_LEVELS } from '../hsk-levels';
import { ChineseCharIcon, SparklesIcon, TypeIcon, TrophyIcon, PencilIcon } from './icons'; 

interface HomePageProps {
  onSelectSection: (section: Section) => void;
  onSelectHSKLevel: (level: string) => void;
}

const practiceModules = [
  {
    id: Section.HANDWRITING_PRACTICE,
    title: 'Ghi nhớ chép chính tả',
    description: 'Luyện viết chữ Hán để cải thiện trí nhớ và độ chính xác.',
    icon: <TypeIcon className="w-12 h-12 text-blue-500" />,
    color: 'blue',
  },
  {
    id: Section.VOCABULARY_PRACTICE,
    title: 'Luyện từ vựng',
    description: 'Củng cố vốn từ qua flashcards, quizzes, ghép từ và nhiều hơn nữa.',
    icon: <ChineseCharIcon className="w-12 h-12 text-green-500" />,
    color: 'green',
  },
  {
    id: Section.WRITING_TEST,
    title: 'Viết (Writing Test)',
    description: 'Luyện kỹ năng viết HSK (Sắp xếp câu, viết đoạn văn...).',
    icon: <PencilIcon className="w-12 h-12 text-purple-500" />,
    color: 'purple',
  },
];

const HomePage: React.FC<HomePageProps> = ({ onSelectSection, onSelectHSKLevel }) => {
  const [selectedHSKLevel, setSelectedHSKLevel] = useState<string>('HSK 1');

  // Handle local level change if we want to sync with parent
  const handleLevelChange = (level: string) => {
    setSelectedHSKLevel(level);
    onSelectHSKLevel(level);
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="text-center mb-12 animate-fade-in-up">
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 dark:text-blue-100 mb-4 tracking-tight">
          Chào mừng đến với <span className="text-blue-600 dark:text-blue-400">Pavex HSK</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Nền tảng luyện thi HSK toàn diện: Từ vựng, Ngữ pháp, và Kỹ năng viết.
        </p>
      </div>

      <div className="mb-10 flex justify-center">
        <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-2 overflow-x-auto max-w-full">
          <span className="text-gray-500 dark:text-gray-400 font-medium px-2 whitespace-nowrap">Chọn cấp độ:</span>
          {HSK_LEVELS.map((levelData) => (
            <button
              key={levelData.level}
              onClick={() => handleLevelChange(levelData.level)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                selectedHSKLevel === levelData.level
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {levelData.label}
            </button>
          ))}
          <button
             onClick={() => handleLevelChange('CUSTOM')}
             className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                selectedHSKLevel === 'CUSTOM'
                  ? 'bg-purple-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
          >
            Tự chọn
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 px-4">
        {practiceModules.map((module) => (
          <div
            key={module.id}
            onClick={() => onSelectSection(module.id)}
            className={`group bg-${module.color}-100 dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-${module.color}-300 hover:border-${module.color}-600 dark:border-${module.color}-900 dark:hover:border-${module.color}-500 transform hover:-translate-y-1 relative overflow-hidden`}
          >
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300`}>
                {module.icon}
            </div>
            
            <div className="flex items-start space-x-6 relative z-10">
              <div className={`p-4 rounded-xl bg-white dark:bg-slate-700 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                {module.icon}
              </div>
              <div className="flex-1">
                <h3 className={`text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-${module.color}-600 dark:group-hover:text-${module.color}-400 transition-colors`}>
                  {module.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {module.description}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
                <span className={`text-sm font-medium text-${module.color}-600 dark:text-${module.color}-400 group-hover:translate-x-1 transition-transform duration-200 flex items-center`}>
                    Bắt đầu ngay &rarr;
                </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Hơn 5000+ từ vựng và bài tập đang chờ bạn khám phá.</p>
      </div>
    </div>
  );
};

export default HomePage;