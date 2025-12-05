
import React, { useState, useEffect, useMemo } from 'react';
import * as storageService from '../storageService';
import { PracticeSession, Section, VocabularyPracticeMode } from '../types';
import SessionDetailView from './SessionDetailView';
import { HSK_LEVELS } from '../hsk-levels';

const ITEMS_PER_PAGE = 20;

type FilterType = 'all' | '7days' | 'thisMonth' | '3months' | '6months' | 'thisYear';

const filterOptions: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: '7days', label: '7 ngày qua' },
  { key: 'thisMonth', label: 'Tháng này' },
  { key: '3months', label: '3 tháng qua' },
  { key: '6months', label: '6 tháng qua' },
  { key: 'thisYear', label: 'Năm nay' },
];

const getModeDisplayName = (session: PracticeSession): string => {
    if (session.section === Section.HANDWRITING_PRACTICE) {
        return 'Chép chính tả';
    }
    if (session.section === Section.VOCABULARY_PRACTICE) {
        switch (session.mode as VocabularyPracticeMode) {
            case VocabularyPracticeMode.QUIZ: return 'Quiz';
            case VocabularyPracticeMode.MATCHING_WORDS: return 'Ghép Từ';
            case VocabularyPracticeMode.LISTEN_AND_SELECT: return 'Nghe và Chọn';
            case VocabularyPracticeMode.FILL_IN_THE_BLANKS: return 'Điền Từ';
            case VocabularyPracticeMode.FLASHCARD: return 'Flashcard';
            default: return 'Từ vựng';
        }
    }
    return 'Luyện tập';
}

const PracticeHistory: React.FC = () => {
  const [history, setHistory] = useState<PracticeSession[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [hskFilter, setHskFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSession, setSelectedSession] = useState<PracticeSession | null>(null);

  useEffect(() => {
    setHistory(storageService.getPracticeHistory());
  }, []);

  const filteredHistory = useMemo(() => {
    const now = new Date();
    return history.filter(session => {
      const sessionDate = new Date(session.timestamp);
      
      // Date Filtering
      let dateMatch = true;
      switch (filter) {
        case '7days':
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(now.getDate() - 7);
          dateMatch = sessionDate >= sevenDaysAgo;
          break;
        case 'thisMonth':
          dateMatch = sessionDate.getMonth() === now.getMonth() && sessionDate.getFullYear() === now.getFullYear();
          break;
        case '3months':
          const threeMonthsAgo = new Date(now);
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          dateMatch = sessionDate >= threeMonthsAgo;
          break;
        case '6months':
            const sixMonthsAgo = new Date(now);
            sixMonthsAgo.setMonth(now.getMonth() - 6);
            dateMatch = sessionDate >= sixMonthsAgo;
            break;
        case 'thisYear':
          dateMatch = sessionDate.getFullYear() === now.getFullYear();
          break;
        case 'all':
        default:
          dateMatch = true;
          break;
      }

      // HSK Level Filtering
      const hskMatch = hskFilter === 'all' || session.hskLevel === hskFilter;

      return dateMatch && hskMatch;
    });
  }, [history, filter, hskFilter]);

  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredHistory, currentPage]);

  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page on filter change
  };

  if (selectedSession) {
    return <SessionDetailView session={selectedSession} onClose={() => setSelectedSession(null)} />;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 bg-blue-100 dark:bg-slate-800 rounded-lg shadow-xl max-w-7xl mt-8">
      <h2 className="text-3xl font-extrabold text-center text-blue-800 dark:text-blue-300 mb-6">
        Lịch sử luyện tập
      </h2>

      <div className="flex flex-col items-center mb-6 gap-4">
        {/* Date Filters */}
        <div className="flex flex-wrap gap-3 justify-center">
          {filterOptions.map(option => (
            <button
              key={option.key}
              onClick={() => handleFilterChange(option.key)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                filter === option.key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-blue-100 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* HSK Level Filter */}
        <div className="flex items-center bg-white dark:bg-slate-700 rounded-lg px-4 py-2 shadow-sm">
            <label htmlFor="hsk-level-filter" className="mr-3 font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                Cấp độ HSK:
            </label>
            <select
                id="hsk-level-filter"
                value={hskFilter}
                onChange={(e) => {
                    setHskFilter(e.target.value);
                    setCurrentPage(1);
                }}
                className="form-select block w-full pl-3 pr-10 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-slate-600 dark:border-gray-500 dark:text-white cursor-pointer"
            >
                <option value="all">Tất cả</option>
                {HSK_LEVELS.map(level => (
                    <option key={level.level} value={level.level}>{level.label}</option>
                ))}
            </select>
        </div>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hoạt động</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Thời gian</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kết quả</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Chi tiết</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedHistory.length > 0 ? paginatedHistory.map(session => (
              <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{getModeDisplayName(session)}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{session.hskLevel} - {session.wordRangeLabel}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {new Date(session.timestamp).toLocaleString('vi-VN')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-semibold">
                  {session.score}/{session.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => setSelectedSession(session)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-bold underline">
                    Chi tiết
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  Không có lịch sử luyện tập nào phù hợp với bộ lọc này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 dark:bg-slate-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-slate-600"
          >
            Trang trước
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 dark:bg-slate-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-slate-600"
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
};

export default PracticeHistory;
