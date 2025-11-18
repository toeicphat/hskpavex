

import React, { useState, useEffect, useCallback } from 'react';
import { HSKLevelData, HSKWord, WordRange, VocabularyPracticeMode } from '../types';
import { HSK_LEVELS } from '../hsk-levels';
import { generateTiengTrung3LessonRanges } from '../tieng-trung-3-lessons'; // New import
import FlashcardPractice from './FlashcardPractice';
import MatchingWordsPractice from './MatchingWordsPractice';
import QuizPractice from './QuizPractice';
import ListenAndSelectPractice from './ListenAndSelectPractice';

interface VocabularyPracticeProps {
  selectedHSKLevel: string;
}

// Function to normalize pinyin for consistent sorting (e.g., remove tones)
const normalizePinyinForGrouping = (pinyin: string): string => {
  return pinyin
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[0-9]/g, "")         // Remove tone numbers
    .toLowerCase()
    .charAt(0);                   // Get first letter
};

const VocabularyPractice: React.FC<VocabularyPracticeProps> = ({ selectedHSKLevel }) => {
  const [currentHSKData, setCurrentHSKData] = useState<HSKLevelData | null>(null);
  const [selectedPracticeMode, setSelectedPracticeMode] = useState<VocabularyPracticeMode | null>(null);
  const [selectedWordRange, setSelectedWordRange] = useState<WordRange | null>(null);
  const [practiceWords, setPracticeWords] = useState<HSKWord[]>([]);
  const [isPracticeStarted, setIsPracticeStarted] = useState<boolean>(false);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const [dynamicWordRanges, setDynamicWordRanges] = useState<WordRange[]>([]);
  const [customRangeStart, setCustomRangeStart] = useState<string>('');
  const [customRangeEnd, setCustomRangeEnd] = useState<string>('');

  // Generates numerical ranges for HSK 1-4
  const generateNumericalRanges = useCallback((totalWords: number) => {
    const ranges: WordRange[] = [];
    const step = 30; // Increment by 30 words
    for (let i = 0; i < totalWords; i += step) {
      const start = i + 1;
      const end = Math.min(i + step, totalWords);
      ranges.push({ start, end, label: `${start} - ${end}` });
    }
    if (totalWords > 0) {
      ranges.push({ start: 1, end: totalWords, label: 'Tất cả' });
    }
    return ranges;
  }, []);

  // Generates Pinyin-based ranges for HSK 5 and HSK 6
  const generatePinyinRanges = useCallback((words: HSKWord[]) => {
    const ranges: WordRange[] = [];
    if (words.length === 0) return ranges;

    let currentStart = 0;
    let currentPinyinChar = normalizePinyinForGrouping(words[0].pinyin);

    for (let i = 0; i < words.length; i++) {
      const wordPinyinChar = normalizePinyinForGrouping(words[i].pinyin);
      if (wordPinyinChar !== currentPinyinChar) {
        // End of current Pinyin group, add range
        ranges.push({
          start: currentStart + 1, // 1-based index
          end: i, // 1-based index
          label: `${currentPinyinChar.toUpperCase()} (${i - currentStart} từ)` // Display count
        });
        currentStart = i;
        currentPinyinChar = wordPinyinChar;
      }
    }
    // Add the last group
    if (currentStart < words.length) {
      ranges.push({
        start: currentStart + 1,
        end: words.length,
        label: `${currentPinyinChar.toUpperCase()} (${words.length - currentStart} từ)` // Display count
      });
    }

    if (words.length > 0) {
      ranges.push({ start: 1, end: words.length, label: 'Tất cả' });
    }

    return ranges;
  }, []);

  useEffect(() => {
    const hskData = HSK_LEVELS.find(hsk => hsk.level === selectedHSKLevel);
    setCurrentHSKData(hskData || null);
    if (hskData) {
      if (selectedHSKLevel === 'HSK 5' || selectedHSKLevel === 'HSK 6') { // Apply Pinyin ranges for HSK 5 and HSK 6
        // HSK 5 & 6 words are pre-sorted by pinyin
        setDynamicWordRanges(generatePinyinRanges(hskData.words));
      } else if (selectedHSKLevel === 'TIENG TRUNG 3') { // Apply lesson-based ranges for Tiếng Trung 3
        setDynamicWordRanges(generateTiengTrung3LessonRanges(hskData.words.length));
      }
      else {
        setDynamicWordRanges(generateNumericalRanges(hskData.words.length));
      }
    } else {
      setDynamicWordRanges([]); // Clear ranges if no data
    }
    // Reset practice state if HSK level changes
    resetPracticeState();
  }, [selectedHSKLevel, generateNumericalRanges, generatePinyinRanges]);

  const resetPracticeState = () => {
    setSelectedPracticeMode(null);
    setSelectedWordRange(null);
    setPracticeWords([]);
    setIsPracticeStarted(false);
    setMessage('');
    setCustomRangeStart('');
    setCustomRangeEnd('');
  };

  const initializePracticeWords = useCallback(() => {
    if (!currentHSKData || !selectedWordRange) {
      setMessage('Vui lòng chọn phạm vi từ vựng.');
      setPracticeWords([]);
      return;
    }

    let wordsToUse = currentHSKData.words;

    const startIdx = selectedWordRange.start ? selectedWordRange.start - 1 : 0; // Adjust for 0-based index
    const endIdx = selectedWordRange.end || wordsToUse.length; // If end is not defined, go to end of list
    const filteredByRange = wordsToUse.slice(startIdx, endIdx);

    if (filteredByRange.length === 0) {
      setMessage('Không có từ vựng cho phạm vi này. Vui lòng chọn phạm vi khác.');
      setPracticeWords([]);
      return;
    }

    setPracticeWords(filteredByRange);
    setMessage('');
  }, [currentHSKData, selectedWordRange]);

  const handleStartPractice = () => {
    if (!selectedPracticeMode) {
      setMessage('Vui lòng chọn một chế độ luyện tập.');
      return;
    }
    if (!selectedWordRange) {
      setMessage('Vui lòng chọn phạm vi từ vựng để bắt đầu.');
      return;
    }
    if (currentHSKData?.words.length === 0) {
      setMessage('Không có từ vựng cho cấp độ này.');
      return;
    }

    initializePracticeWords();
    setIsPracticeStarted(true);
  };

  const handlePracticeEnd = (feedbackMessage: string) => {
    setMessage(feedbackMessage);
    setIsPracticeStarted(false);
    setPracticeWords([]); // Clear practice words after session
  };

  const handleGoBackToSelection = () => {
    resetPracticeState();
  };

  if (!currentHSKData) {
    return <div className="text-center p-8">Đang tải dữ liệu HSK...</div>;
  }

  const totalWordsInLevel = currentHSKData.words.length;
  // Combine conditions for hiding custom range input
  const hideCustomRange = selectedHSKLevel === 'HSK 5' || selectedHSKLevel === 'HSK 6' || selectedHSKLevel === 'TIENG TRUNG 3';

  return (
    <div className="container mx-auto p-4 md:p-8 bg-blue-100 dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl mt-8">
      <h2 className="text-3xl font-extrabold text-center text-blue-800 dark:text-blue-300 mb-6">
        Luyện từ vựng: {currentHSKData.label}
      </h2>

      {message && <p className="text-red-500 text-center mb-4">{message}</p>}

      {!isPracticeStarted ? (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">1. Chọn chế độ luyện tập:</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setSelectedPracticeMode(VocabularyPracticeMode.FLASHCARD)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedPracticeMode === VocabularyPracticeMode.FLASHCARD
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-green-100 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
                }`}
                aria-pressed={selectedPracticeMode === VocabularyPracticeMode.FLASHCARD}
              >
                Flashcard
              </button>
              <button
                onClick={() => setSelectedPracticeMode(VocabularyPracticeMode.MATCHING_WORDS)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedPracticeMode === VocabularyPracticeMode.MATCHING_WORDS
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-green-100 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
                }`}
                aria-pressed={selectedPracticeMode === VocabularyPracticeMode.MATCHING_WORDS}
              >
                Ghép Từ
              </button>
              <button
                onClick={() => setSelectedPracticeMode(VocabularyPracticeMode.QUIZ)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedPracticeMode === VocabularyPracticeMode.QUIZ
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-green-100 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
                }`}
                aria-pressed={selectedPracticeMode === VocabularyPracticeMode.QUIZ}
              >
                Quiz
              </button>
              <button
                onClick={() => setSelectedPracticeMode(VocabularyPracticeMode.LISTEN_AND_SELECT)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedPracticeMode === VocabularyPracticeMode.LISTEN_AND_SELECT
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-green-100 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
                }`}
                aria-pressed={selectedPracticeMode === VocabularyPracticeMode.LISTEN_AND_SELECT}
              >
                Nghe và Chọn Từ
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">2. Chọn số lượng từ:</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {dynamicWordRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => {
                    setSelectedWordRange(range);
                    setMessage('');
                  }}
                  className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                    selectedWordRange?.label === range.label
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-purple-100 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
                  }`}
                  aria-pressed={selectedWordRange?.label === range.label}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {!hideCustomRange && ( // Hide custom range input for HSK 5, HSK 6, and Tiếng Trung 3
            <div className="mb-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">3. Chọn phạm vi tùy chỉnh (tùy chọn):</h3>
              <div className="flex items-center justify-center gap-2 mb-3">
                <label htmlFor="vocab-custom-start" className="sr-only">Từ</label>
                <input
                  id="vocab-custom-start"
                  type="number"
                  min="1"
                  max={totalWordsInLevel > 0 ? totalWordsInLevel : 1}
                  value={customRangeStart}
                  onChange={(e) => setCustomRangeStart(e.target.value)}
                  placeholder="Từ"
                  className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-gray-200 text-center"
                  aria-label="Từ số"
                />
                <span className="text-gray-700 dark:text-gray-300">-</span>
                <label htmlFor="vocab-custom-end" className="sr-only">Đến</label>
                <input
                  id="vocab-custom-end"
                  type="number"
                  min="1"
                  max={totalWordsInLevel > 0 ? totalWordsInLevel : 1}
                  value={customRangeEnd}
                  onChange={(e) => setCustomRangeEnd(e.target.value)}
                  placeholder="Đến"
                  className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-gray-200 text-center"
                  aria-label="Đến số"
                />
              </div>
              <button
                onClick={() => {
                  const start = parseInt(customRangeStart);
                  const end = parseInt(customRangeEnd);
                  
                  if (isNaN(start) || isNaN(end) || start < 1 || end < 1 || start > end || start > totalWordsInLevel || end > totalWordsInLevel) {
                    setMessage('Phạm vi tùy chỉnh không hợp lệ. Vui lòng nhập số hợp lệ trong khoảng từ 1 đến ' + totalWordsInLevel + '.');
                    setSelectedWordRange(null); // Deselect any previous range
                    return;
                  }
                  setSelectedWordRange({ start, end, label: `Tùy chỉnh: ${start}-${end}` });
                  setMessage('');
                }}
                className={`bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md ${
                  (customRangeStart === '' || customRangeEnd === '' || isNaN(parseInt(customRangeStart)) || isNaN(parseInt(customRangeEnd))) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={customRangeStart === '' || customRangeEnd === '' || isNaN(parseInt(customRangeStart)) || isNaN(parseInt(customRangeEnd))}
                aria-label="Áp dụng phạm vi tùy chỉnh"
              >
                Áp dụng phạm vi tùy chỉnh
              </button>
            </div>
          )}

          {(selectedPracticeMode === VocabularyPracticeMode.MATCHING_WORDS || selectedPracticeMode === VocabularyPracticeMode.QUIZ || selectedPracticeMode === VocabularyPracticeMode.LISTEN_AND_SELECT) && (
            <div className="mb-6 flex items-center justify-center gap-3">
              <input
                type="checkbox"
                id="autoAdvance"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500 transition-colors duration-200"
                aria-label="Tự động chuyển tiếp sau khi trả lời đúng"
              />
              <label htmlFor="autoAdvance" className="text-lg text-gray-800 dark:text-gray-200 cursor-pointer">
                Tự động chuyển tiếp sau khi trả lời đúng
              </label>
            </div>
          )}

          <div className="text-center mt-8">
            <button
              onClick={handleStartPractice}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              disabled={!selectedPracticeMode || !selectedWordRange || currentHSKData?.words.length === 0}
            >
              Bắt đầu luyện tập
            </button>
          </div>
        </>
      ) : (
        <div className="relative">
          <h2 className="text-3xl font-extrabold text-center text-blue-800 dark:text-blue-300 mb-6">
            Luyện từ vựng: {currentHSKData?.label} -{' '}
            {selectedPracticeMode === VocabularyPracticeMode.FLASHCARD ? 'Flashcard' : 
             (selectedPracticeMode === VocabularyPracticeMode.MATCHING_WORDS ? 'Ghép Từ' : 
              (selectedPracticeMode === VocabularyPracticeMode.QUIZ ? 'Quiz' : 'Nghe và Chọn Từ'))}
          </h2>

          {message && (
            <div className="text-center p-4 mb-4 bg-blue-200 dark:bg-slate-700 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200 text-xl font-semibold">{message}</p>
            </div>
          )}

          {practiceWords.length === 0 ? (
            <div className="text-center p-8 bg-blue-100 dark:bg-slate-800 rounded-lg shadow-xl mt-8 max-w-2xl mx-auto">
              <p className="text-xl text-red-500 mb-4">{message || 'Không có từ vựng để luyện tập. Vui lòng thử lại với các lựa chọn khác.'}</p>
              <button
                onClick={handleGoBackToSelection}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-lg transition-all duration-300"
              >
                Quay lại lựa chọn
              </button>
            </div>
          ) : (
            <>
              {selectedPracticeMode === VocabularyPracticeMode.FLASHCARD && (
                <FlashcardPractice words={practiceWords} onPracticeEnd={handlePracticeEnd} onGoBack={handleGoBackToSelection} />
              )}

              {selectedPracticeMode === VocabularyPracticeMode.MATCHING_WORDS && (
                <MatchingWordsPractice words={practiceWords} autoAdvance={autoAdvance} onPracticeEnd={handlePracticeEnd} onGoBack={handleGoBackToSelection} />
              )}

              {selectedPracticeMode === VocabularyPracticeMode.QUIZ && (
                <QuizPractice words={practiceWords} autoAdvance={autoAdvance} onPracticeEnd={handlePracticeEnd} onGoBack={handleGoBackToSelection} />
              )}

              {selectedPracticeMode === VocabularyPracticeMode.LISTEN_AND_SELECT && (
                <ListenAndSelectPractice words={practiceWords} autoAdvance={autoAdvance} onPracticeEnd={handlePracticeEnd} onGoBack={handleGoBackToSelection} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VocabularyPractice;