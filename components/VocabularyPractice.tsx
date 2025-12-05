
import React, { useState, useEffect, useCallback } from 'react';
import { HSKLevelData, HSKWord, WordRange, VocabularyPracticeMode, DifficultyLevel } from '../types';
import { HSK_LEVELS } from '../hsk-levels';
import { generateTiengTrung3LessonRanges } from '../tieng-trung-3-lessons';
import { generateTiengTrung4LessonRanges } from '../tieng-trung-4-lessons';
import FlashcardPractice from './FlashcardPractice';
import MatchingWordsPractice from './MatchingWordsPractice';
import QuizPractice from './QuizPractice';
import ListenAndSelectPractice from './ListenAndSelectPractice';
import FillInTheBlanksPractice from './FillInTheBlanksPractice'; // New import
import * as storageService from '../storageService';
import { GoogleGenAI, Type } from "@google/genai";
import { LoadingIcon } from './icons';


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
  
  const [hardWordsCount, setHardWordsCount] = useState(0);
  const [reviewWordsCount, setReviewWordsCount] = useState(0);

  // New state for difficulty selection in FillInTheBlanks mode
  const [selectedUserDifficulty, setSelectedUserDifficulty] = useState<DifficultyLevel>(DifficultyLevel.MEDIUM);

  // Custom Level State
  const [isCustomLevel, setIsCustomLevel] = useState(false);
  const [customInputText, setCustomInputText] = useState('');
  const [isParsingCustom, setIsParsingCustom] = useState(false);


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
    if (selectedHSKLevel === 'CUSTOM') {
      setIsCustomLevel(true);
      const customWords = storageService.getCustomVocabulary();
      const customData = { level: 'CUSTOM', label: 'Tự chọn', words: customWords };
      setCurrentHSKData(customData);
      setDynamicWordRanges([{ start: 1, end: customWords.length, label: 'Tất cả từ tự chọn' }]);
      // Custom words don't support SRS/Hard words logic yet as they are dynamic
      setHardWordsCount(0);
      setReviewWordsCount(0);
    } else {
      setIsCustomLevel(false);
      const hskData = HSK_LEVELS.find(hsk => hsk.level === selectedHSKLevel);
      setCurrentHSKData(hskData || null);

      if (hskData) {
        let baseRanges: WordRange[] = [];
        if (selectedHSKLevel === 'HSK 5' || selectedHSKLevel === 'HSK 6') {
          baseRanges = generatePinyinRanges(hskData.words);
        } else if (selectedHSKLevel === 'TIENG TRUNG 3') {
          baseRanges = generateTiengTrung3LessonRanges(hskData.words.length);
        } else if (selectedHSKLevel === 'TIENG TRUNG 4') {
          baseRanges = generateTiengTrung4LessonRanges(hskData.words.length);
        } else {
          baseRanges = generateNumericalRanges(hskData.words.length);
        }

        const hardWordsForLevel = storageService.getHardWords(hskData.words);
        const reviewWordsForLevel = storageService.getReviewWords(hskData.words);
        setHardWordsCount(hardWordsForLevel.length);
        setReviewWordsCount(reviewWordsForLevel.length);

        const specialRanges: WordRange[] = [];
        if (reviewWordsForLevel.length > 0) {
          specialRanges.push({ start: -2, end: -2, label: `Ôn tập SRS (${reviewWordsForLevel.length})` });
        }
        if (hardWordsForLevel.length > 0) {
          specialRanges.push({ start: -1, end: -1, label: `Ôn tập từ khó (${hardWordsForLevel.length})` });
        }

        setDynamicWordRanges([...specialRanges, ...baseRanges]);
      } else {
        setDynamicWordRanges([]);
      }
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
    setAutoAdvance(false); // Reset auto-advance
    setCustomRangeStart('');
    setCustomRangeEnd('');
    setSelectedUserDifficulty(DifficultyLevel.MEDIUM); // Reset difficulty to default
  };

  const initializePracticeWords = useCallback(() => {
    if (!currentHSKData || !selectedWordRange) {
      setMessage('Vui lòng chọn phạm vi từ vựng.');
      return [];
    }
    
    // Handle special ranges
    if (selectedWordRange.label.startsWith('Ôn tập từ khó')) {
      return storageService.getHardWords(currentHSKData.words);
    }
    if (selectedWordRange.label.startsWith('Ôn tập SRS')) {
      return storageService.getReviewWords(currentHSKData.words);
    }

    // Handle normal ranges
    const startIdx = selectedWordRange.start - 1;
    const endIdx = selectedWordRange.end;
    const filteredByRange = currentHSKData.words.slice(startIdx, endIdx);
    
    return filteredByRange;
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

    const wordsToPractice = initializePracticeWords();

    if (wordsToPractice.length === 0) {
      setMessage('Không có từ vựng cho phạm vi này. Vui lòng chọn phạm vi khác.');
      setPracticeWords([]);
      return;
    }
    
    setPracticeWords(wordsToPractice);
    setIsPracticeStarted(true);
    setMessage('');
  };

  const handleParseCustomWords = async () => {
    if (!customInputText.trim()) {
      setMessage('Vui lòng nhập danh sách từ.');
      return;
    }
    setIsParsingCustom(true);
    setMessage('');

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Parse the following text into a list of Chinese words. 
        The input format is roughly "ChineseCharacter [space] VietnameseMeaning" or just "ChineseCharacter".
        Some lines might have punctuation.
        
        Task:
        1. Identify the Chinese word (Mandarin).
        2. Identify the Vietnamese meaning.
        3. GENERATE the Pinyin for the Chinese word accurately.
        
        Input Text:
        ${customInputText}
        
        Output JSON format: Array of objects with keys: mandarin, pinyin, vietnamese.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                mandarin: { type: Type.STRING },
                pinyin: { type: Type.STRING },
                vietnamese: { type: Type.STRING },
              },
              required: ['mandarin', 'pinyin', 'vietnamese'],
            },
          },
        },
      });

      const parsedWords = JSON.parse(response.text || '[]');
      if (parsedWords.length > 0) {
        storageService.saveCustomVocabulary(parsedWords);
        const customData = { level: 'CUSTOM', label: 'Tự chọn', words: parsedWords };
        setCurrentHSKData(customData);
        setDynamicWordRanges([{ start: 1, end: parsedWords.length, label: 'Tất cả từ tự chọn' }]);
        setCustomInputText('');
        setMessage(`Đã lưu thành công ${parsedWords.length} từ!`);
      } else {
        setMessage('Không tìm thấy từ hợp lệ. Vui lòng kiểm tra lại định dạng.');
      }
    } catch (error) {
      console.error("Error parsing custom words:", error);
      setMessage('Lỗi khi xử lý từ vựng. Vui lòng thử lại.');
    } finally {
      setIsParsingCustom(false);
    }
  };
  
  const handleWordResult = useCallback((word: HSKWord, isCorrect: boolean) => {
    storageService.updateWordOnResult(word, isCorrect);
    // If practicing hard words and got it right, unmark it
    if (selectedWordRange?.label.startsWith('Ôn tập từ khó') && isCorrect) {
      storageService.markWordAsHard(word, false);
      // Update count for UI consistency
      setHardWordsCount(prev => Math.max(0, prev - 1));
    }
  }, [selectedWordRange]);


  // Modified to accept an `isFinal` flag
  const handlePracticeEnd = (feedbackMessage: string, isFinal: boolean) => {
    setMessage(feedbackMessage);
    if (isFinal) {
      setIsPracticeStarted(false);
      setPracticeWords([]); // Clear practice words after session
       // Refresh counts on final end
      if (currentHSKData && !isCustomLevel) {
        setHardWordsCount(storageService.getHardWords(currentHSKData.words).length);
        setReviewWordsCount(storageService.getReviewWords(currentHSKData.words).length);
      }
    }
  };

  const handleGoBackToSelection = () => {
    resetPracticeState();
    // Refresh counts on going back
    if (currentHSKData && !isCustomLevel) {
        setHardWordsCount(storageService.getHardWords(currentHSKData.words).length);
        setReviewWordsCount(storageService.getReviewWords(currentHSKData.words).length);
      }
  };

  if (!currentHSKData) {
    return <div className="text-center p-8">Đang tải dữ liệu HSK...</div>;
  }

  const totalWordsInLevel = currentHSKData.words.length;
  // Combine conditions for hiding custom range input
  const hideCustomRange = selectedHSKLevel === 'HSK 5' || selectedHSKLevel === 'HSK 6' || selectedHSKLevel === 'TIENG TRUNG 3' || selectedHSKLevel === 'TIENG TRUNG 4';

  return (
    <div className="container mx-auto p-4 md:p-8 bg-blue-100 dark:bg-slate-800 rounded-lg shadow-xl max-w-5xl mt-8">
      <h2 className="text-3xl font-extrabold text-center text-blue-800 dark:text-blue-300 mb-6">
        Luyện từ vựng: {currentHSKData.label}
      </h2>

      {message && <p className={`text-center mb-4 ${message.includes('thành công') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}

      {!isPracticeStarted ? (
        <>
          {isCustomLevel && (
            <div className="mb-8 p-6 bg-white dark:bg-slate-700 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Nhập từ vựng tự chọn</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Nhập danh sách từ (ví dụ: "我 tôi" hoặc "爸爸 ba"), mỗi từ một dòng hoặc cách nhau bằng dấu phẩy. Hệ thống sẽ tự động tạo Pinyin.
              </p>
              <textarea
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white mb-4"
                placeholder="Ví dụ:
我 tôi
你 bạn
好 tốt"
                value={customInputText}
                onChange={(e) => setCustomInputText(e.target.value)}
              />
              <div className="flex gap-4">
                <button
                  onClick={handleParseCustomWords}
                  disabled={isParsingCustom}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center"
                >
                  {isParsingCustom && <LoadingIcon className="w-5 h-5 animate-spin mr-2" />}
                  {isParsingCustom ? 'Đang xử lý...' : 'Lưu & Cập nhật danh sách'}
                </button>
                {currentHSKData.words.length > 0 && (
                  <div className="text-gray-500 dark:text-gray-400 self-center">
                    Hiện có: {currentHSKData.words.length} từ
                  </div>
                )}
              </div>
            </div>
          )}

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
                onClick={() => {
                  setSelectedPracticeMode(VocabularyPracticeMode.LISTEN_AND_SELECT);
                  setSelectedUserDifficulty(DifficultyLevel.EASY); // Default to Easy when selecting this mode
                }}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedPracticeMode === VocabularyPracticeMode.LISTEN_AND_SELECT
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-green-100 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
                }`}
                aria-pressed={selectedPracticeMode === VocabularyPracticeMode.LISTEN_AND_SELECT}
              >
                Nghe và Chọn Từ
              </button>
              <button
                onClick={() => {
                  setSelectedPracticeMode(VocabularyPracticeMode.FILL_IN_THE_BLANKS);
                  setSelectedUserDifficulty(DifficultyLevel.MEDIUM); // Default to Medium for this mode
                }}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedPracticeMode === VocabularyPracticeMode.FILL_IN_THE_BLANKS
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-green-100 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
                }`}
                aria-pressed={selectedPracticeMode === VocabularyPracticeMode.FILL_IN_THE_BLANKS}
              >
                Điền Từ Thích Hợp
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

          {!hideCustomRange && !isCustomLevel && ( // Hide custom range input for HSK 5, HSK 6, Tiếng Trung 3, Tiếng Trung 4, and Custom Level
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

          {/* Difficulty selection for Fill-in-the-blanks and Listen-and-Select mode */}
          {(selectedPracticeMode === VocabularyPracticeMode.FILL_IN_THE_BLANKS || 
            selectedPracticeMode === VocabularyPracticeMode.LISTEN_AND_SELECT) && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">4. Chọn độ khó:</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {selectedPracticeMode === VocabularyPracticeMode.LISTEN_AND_SELECT ? (
                  <>
                    <button
                      onClick={() => setSelectedUserDifficulty(DifficultyLevel.EASY)}
                      className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                        selectedUserDifficulty === DifficultyLevel.EASY
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-green-100 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
                      }`}
                      aria-pressed={selectedUserDifficulty === DifficultyLevel.EASY}
                    >
                      Dễ (Hiện đầy đủ thông tin)
                    </button>
                    <button
                      onClick={() => setSelectedUserDifficulty(DifficultyLevel.HARD)}
                      className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                        selectedUserDifficulty === DifficultyLevel.HARD
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-red-100 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
                      }`}
                      aria-pressed={selectedUserDifficulty === DifficultyLevel.HARD}
                    >
                      Khó (Chỉ hiện chữ Hán)
                    </button>
                  </>
                ) : (
                  <>
                    {/* Default Difficulty Options for Fill In The Blanks */}
                    <button
                      onClick={() => setSelectedUserDifficulty(DifficultyLevel.EASY)}
                      className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                        selectedUserDifficulty === DifficultyLevel.EASY
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-green-100 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
                      }`}
                      aria-pressed={selectedUserDifficulty === DifficultyLevel.EASY}
                    >
                      Dễ
                    </button>
                    <button
                      onClick={() => setSelectedUserDifficulty(DifficultyLevel.MEDIUM)}
                      className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                        selectedUserDifficulty === DifficultyLevel.MEDIUM
                          ? 'bg-yellow-600 text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-yellow-100 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
                      }`}
                      aria-pressed={selectedUserDifficulty === DifficultyLevel.MEDIUM}
                    >
                      Trung bình
                    </button>
                    <button
                      onClick={() => setSelectedUserDifficulty(DifficultyLevel.HARD)}
                      className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                        selectedUserDifficulty === DifficultyLevel.HARD
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-red-100 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
                      }`}
                      aria-pressed={selectedUserDifficulty === DifficultyLevel.HARD}
                    >
                      Khó
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Auto advance checkbox logic - apply to relevant modes */}
          {selectedPracticeMode && ![VocabularyPracticeMode.FLASHCARD].includes(selectedPracticeMode) && (
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
              disabled={
                !selectedPracticeMode || 
                !selectedWordRange || 
                currentHSKData?.words.length === 0 ||
                ((selectedPracticeMode === VocabularyPracticeMode.FILL_IN_THE_BLANKS || selectedPracticeMode === VocabularyPracticeMode.LISTEN_AND_SELECT) && !selectedUserDifficulty)
              }
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
              (selectedPracticeMode === VocabularyPracticeMode.QUIZ ? 'Quiz' : 
                (selectedPracticeMode === VocabularyPracticeMode.LISTEN_AND_SELECT ? 'Nghe và Chọn Từ' : 
                  (selectedPracticeMode === VocabularyPracticeMode.FILL_IN_THE_BLANKS ? 'Điền Từ Thích Hợp' : ''))))}
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
                <MatchingWordsPractice 
                  words={practiceWords} 
                  autoAdvance={autoAdvance} 
                  onPracticeEnd={handlePracticeEnd} 
                  onGoBack={handleGoBackToSelection} 
                  onWordResult={handleWordResult}
                  selectedHSKLevel={selectedHSKLevel}
                  wordRangeLabel={selectedWordRange?.label || ''}
                />
              )}

              {selectedPracticeMode === VocabularyPracticeMode.QUIZ && (
                <QuizPractice 
                  words={practiceWords} 
                  fullVocabulary={currentHSKData.words} // Pass full vocab for distractors
                  autoAdvance={autoAdvance} 
                  onPracticeEnd={handlePracticeEnd} 
                  onGoBack={handleGoBackToSelection} 
                  onWordResult={handleWordResult}
                  selectedHSKLevel={selectedHSKLevel}
                  wordRangeLabel={selectedWordRange?.label || ''}
                />
              )}

              {selectedPracticeMode === VocabularyPracticeMode.LISTEN_AND_SELECT && (
                <ListenAndSelectPractice 
                  words={practiceWords} 
                  fullVocabulary={currentHSKData.words} // Pass full vocab for distractors
                  selectedUserDifficulty={selectedUserDifficulty}
                  autoAdvance={autoAdvance} 
                  onPracticeEnd={handlePracticeEnd} 
                  onGoBack={handleGoBackToSelection} 
                  onWordResult={handleWordResult}
                  selectedHSKLevel={selectedHSKLevel}
                  wordRangeLabel={selectedWordRange?.label || ''}
                />
              )}

              {selectedPracticeMode === VocabularyPracticeMode.FILL_IN_THE_BLANKS && (
                <FillInTheBlanksPractice 
                  words={practiceWords} 
                  fullVocabulary={currentHSKData.words} // Pass full vocab for distractors
                  selectedHSKLevel={selectedHSKLevel} 
                  selectedUserDifficulty={selectedUserDifficulty} 
                  autoAdvance={autoAdvance} 
                  onPracticeEnd={handlePracticeEnd} 
                  onGoBack={handleGoBackToSelection} 
                  onWordResult={handleWordResult}
                  wordRangeLabel={selectedWordRange?.label || ''}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VocabularyPractice;
