

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HSKWord, PracticeMode, WordRange, HSKLevelData } from '../types';
import { HSK_WORD_RANGES_PLACEHOLDER } from '../global-constants'; // Updated import path
import { HSK_LEVELS } from '../hsk-levels';
import DrawingCanvas from './DrawingCanvas';
import HSKLevelSelector from './HSKLevelSelector';

interface HandwritingPracticeProps {
  selectedHSKLevel: string;
}

const HandwritingPractice: React.FC<HandwritingPracticeProps> = ({ selectedHSKLevel }) => {
  const [currentHSKData, setCurrentHSKData] = useState<HSKLevelData | null>(null);
  const [selectedMode, setSelectedMode] = useState<PracticeMode>(PracticeMode.PINYIN_VIETNAMESE);
  const [selectedWordRange, setSelectedWordRange] = useState<WordRange | null>(null);
  const [mandarinFilter, setMandarinFilter] = useState<string>(''); // New state for Mandarin character filter
  const [practiceWords, setPracticeWords] = useState<HSKWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean>(false);
  const [userDrawingDataUrl, setUserDrawingDataUrl] = useState<string | null>(null);
  const [isPracticeStarted, setIsPracticeStarted] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const [dynamicWordRanges, setDynamicWordRanges] = useState<WordRange[]>([]);
  const [customRangeStart, setCustomRangeStart] = useState<string>('');
  const [customRangeEnd, setCustomRangeEnd] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateDynamicRanges = useCallback((totalWords: number) => {
    const ranges: WordRange[] = [];
    const step = 30; // Increment by 30 words
    for (let i = 0; i < totalWords; i += step) {
      const start = i + 1;
      const end = Math.min(i + step, totalWords);
      ranges.push({ start, end, label: `${start} - ${end}` });
    }
    if (totalWords > 0) { // Only add 'Tất cả' if there are words
        ranges.push({ start: 1, end: totalWords, label: 'Tất cả' }); // "Tất cả" option
    }
    setDynamicWordRanges(ranges);
  }, []);

  useEffect(() => {
    const hskData = HSK_LEVELS.find(hsk => hsk.level === selectedHSKLevel);
    setCurrentHSKData(hskData || null);
    if (hskData) {
      generateDynamicRanges(hskData.words.length);
    }
    // Reset practice state if HSK level changes
    setIsPracticeStarted(false);
    setSelectedWordRange(null);
    setMandarinFilter(''); // Reset filter
    setPracticeWords([]);
    setCurrentWordIndex(0);
    setShowCorrectAnswer(false);
    setUserDrawingDataUrl(null);
    setMessage('');
    setCustomRangeStart('');
    setCustomRangeEnd('');
  }, [selectedHSKLevel, generateDynamicRanges]);

  const filterWords = useCallback(() => {
    if (!currentHSKData || !selectedWordRange) {
      return;
    }

    let wordsToFilter = currentHSKData.words;

    // Apply Mandarin character filter first
    if (mandarinFilter.trim() !== '') {
      wordsToFilter = wordsToFilter.filter(word => word.mandarin.startsWith(mandarinFilter.trim()));
      if (wordsToFilter.length === 0) {
        setMessage('Không tìm thấy từ nào phù hợp với chữ Hán đã nhập.');
        setPracticeWords([]);
        return;
      }
    }

    const startIdx = selectedWordRange.start > 0 ? selectedWordRange.start - 1 : 0; // Adjust for 0-based index
    const endIdx = selectedWordRange.end === Infinity ? wordsToFilter.length : selectedWordRange.end;
    const filteredByRange = wordsToFilter.slice(startIdx, endIdx);
    
    // Shuffle the filtered words
    const shuffled = [...filteredByRange].sort(() => Math.random() - 0.5);
    setPracticeWords(shuffled);
    setCurrentWordIndex(0);
    setShowCorrectAnswer(false);
    setUserDrawingDataUrl(null);
    setMessage('');
    if (canvasRef.current && 'clear' in canvasRef.current && typeof canvasRef.current.clear === 'function') {
      canvasRef.current.clear();
    }
  }, [currentHSKData, selectedWordRange, mandarinFilter]); // Add mandarinFilter to dependencies

  const handleStartPractice = () => {
    if (!selectedWordRange) {
      setMessage('Vui lòng chọn phạm vi từ vựng để bắt đầu.');
      return;
    }
    if (currentHSKData?.words.length === 0) {
      setMessage('Không có từ vựng cho cấp độ này.');
      return;
    }
    // Filter words before starting the practice
    filterWords();
    setIsPracticeStarted(true);
    setMessage('');
  };

  const handleShowCorrectAnswer = () => {
    setShowCorrectAnswer(true);
  };

  const handleClearCanvas = () => {
    if (canvasRef.current && 'clear' in canvasRef.current && typeof canvasRef.current.clear === 'function') {
      canvasRef.current.clear();
    }
    setUserDrawingDataUrl(null); // Clear stored image data
    setShowCorrectAnswer(false); // Hide correct answer when clearing
  };

  const handleNextWord = () => {
    if (currentWordIndex < practiceWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setShowCorrectAnswer(false);
      setUserDrawingDataUrl(null);
      if (canvasRef.current && 'clear' in canvasRef.current && typeof canvasRef.current.clear === 'function') {
        canvasRef.current.clear();
      }
    } else {
      setMessage('Bạn đã hoàn thành tất cả các từ trong phạm vi này!');
      setIsPracticeStarted(false); // End practice
    }
  };

  const handleDrawingEnd = useCallback((dataUrl: string) => {
    setUserDrawingDataUrl(dataUrl);
  }, []);

  if (!currentHSKData) {
    return <div className="text-center p-8">Đang tải dữ liệu HSK...</div>;
  }

  const totalWordsInLevel = currentHSKData.words.length;

  return (
    <div className="container mx-auto p-4 md:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl mt-8">
      <h2 className="text-3xl font-extrabold text-center text-blue-700 dark:text-blue-300 mb-6">
        Luyện chép chính tả: {currentHSKData.label}
      </h2>

      {message && <p className="text-red-500 text-center mb-4">{message}</p>}

      {!isPracticeStarted ? (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">1. Chọn chế độ luyện tập:</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setSelectedMode(PracticeMode.PINYIN_VIETNAMESE)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedMode === PracticeMode.PINYIN_VIETNAMESE
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-green-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Pinyin & Nghĩa tiếng Việt
              </button>
              <button
                onClick={() => setSelectedMode(PracticeMode.VIETNAMESE_ONLY)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedMode === PracticeMode.VIETNAMESE_ONLY
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-green-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Chỉ nghĩa tiếng Việt
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
                    setMessage(''); // Clear message when new range is selected
                  }}
                  className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                    selectedWordRange?.label === range.label
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-purple-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                  aria-pressed={selectedWordRange?.label === range.label}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">3. Chọn phạm vi tùy chỉnh (tùy chọn):</h3>
            <div className="flex items-center justify-center gap-2 mb-3">
              <label htmlFor="custom-start" className="sr-only">Từ</label>
              <input
                id="custom-start"
                type="number"
                min="1"
                max={totalWordsInLevel > 0 ? totalWordsInLevel : 1}
                value={customRangeStart}
                onChange={(e) => setCustomRangeStart(e.target.value)}
                placeholder="Từ"
                className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 text-center"
                aria-label="Từ số"
              />
              <span className="text-gray-700 dark:text-gray-300">-</span>
              <label htmlFor="custom-end" className="sr-only">Đến</label>
              <input
                id="custom-end"
                type="number"
                min="1"
                max={totalWordsInLevel > 0 ? totalWordsInLevel : 1}
                value={customRangeEnd}
                onChange={(e) => setCustomRangeEnd(e.target.value)}
                placeholder="Đến"
                className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 text-center"
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

          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">4. Lọc theo chữ Hán (tùy chọn):</h3>
            <input
              type="text"
              value={mandarinFilter}
              onChange={(e) => setMandarinFilter(e.target.value)}
              placeholder="Nhập chữ Hán bắt đầu (ví dụ: 你)"
              className="w-full max-w-xs p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 text-center"
              aria-label="Lọc từ vựng theo chữ Hán"
            />
          </div>

          <div className="text-center mt-8">
            <button
              onClick={handleStartPractice}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              disabled={!selectedWordRange || currentHSKData?.words.length === 0}
            >
              Bắt đầu luyện tập
            </button>
          </div>
        </>
      ) : (
        currentHSKData && practiceWords.length > 0 ? (
          <>
            <p className="text-center text-gray-600 dark:text-gray-400 text-lg mb-6">
              Từ {currentWordIndex + 1} / {practiceWords.length}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Word Prompt Section */}
              <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner flex flex-col justify-center min-h-[200px]">
                <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4 text-center">Hãy viết chữ Hán cho từ này:</h3>
                {selectedMode === PracticeMode.PINYIN_VIETNAMESE && (
                  <p className="text-center text-xl text-gray-700 dark:text-gray-300 mb-2">
                    <span className="font-semibold">Pinyin:</span> {practiceWords[currentWordIndex].pinyin}
                  </p>
                )}
                <p className="text-center text-xl text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Nghĩa Việt:</span> {practiceWords[currentWordIndex].vietnamese}
                </p>
              </div>

              {/* Drawing Canvas */}
              <div className="text-center">
                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Khung vẽ của bạn</h4>
                <DrawingCanvas
                  canvasRef={canvasRef}
                  width={300} // Responsive width handled by CSS, actual drawing resolution
                  height={300} // Set a fixed height for a square canvas
                  className="w-full max-w-sm aspect-square border-2 border-dashed border-blue-400 dark:border-blue-600 rounded-md bg-white dark:bg-gray-700 cursor-crosshair touch-none mx-auto"
                  onDrawEnd={handleDrawingEnd}
                />
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8 sticky bottom-0 bg-white dark:bg-gray-800 py-4 rounded-b-lg shadow-t-lg">
              <button
                onClick={handleShowCorrectAnswer}
                disabled={!userDrawingDataUrl}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Hiện đáp án"
              >
                Hiện đáp án
              </button>
              <button
                onClick={handleClearCanvas}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                aria-label="Xóa và viết lại"
              >
                Xóa & Viết lại
              </button>
              <button
                onClick={handleNextWord}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                aria-label="Từ tiếp theo"
              >
                Từ tiếp theo
              </button>
            </div>

            {/* Correct Answer Display */}
            {showCorrectAnswer && (
              <div className="mt-8 p-6 bg-green-50 dark:bg-gray-700 rounded-lg shadow-lg">
                <h4 className="text-2xl font-bold text-green-700 dark:text-green-300 text-center mb-4">Đáp án chính xác:</h4>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  {userDrawingDataUrl && (
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Bài viết của bạn:</p>
                      <img src={userDrawingDataUrl} alt="User drawing" className="border border-gray-300 dark:border-gray-600 rounded-md w-32 h-32 object-contain" />
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Chữ Hán:</p>
                    <p className="text-7xl font-mandarin text-green-800 dark:text-green-200">{practiceWords[currentWordIndex].mandarin}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl mt-8 max-w-2xl mx-auto">
              <p className="text-xl text-red-500 mb-4">{message || 'Không tìm thấy từ nào để luyện tập. Vui lòng thử lại với các lựa chọn khác.'}</p>
              <button
                onClick={() => setIsPracticeStarted(false)} // Go back to selection screen
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-lg transition-all duration-300"
              >
                Quay lại lựa chọn
              </button>
            </div>
        )
      )}
    </div>
  );
};

export default HandwritingPractice;