
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HSKWord, PracticeMode, WordRange, HSKLevelData, PracticeSession, PracticeSessionDetail, Section } from '../types';
import { HSK_LEVELS } from '../hsk-levels';
import { generateTiengTrung3LessonRanges } from '../tieng-trung-3-lessons';
import { generateTiengTrung4LessonRanges } from '../tieng-trung-4-lessons';
import DrawingCanvas, { DrawingCanvasApiRef } from './DrawingCanvas';
import * as storageService from '../storageService';
import { GoogleGenAI, Type } from "@google/genai";
import { LoadingIcon } from './icons';

interface HandwritingPracticeProps {
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

// FIX: Added shuffleArray utility function to resolve 'Cannot find name' errors.
const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

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

  // Custom Level State
  const [isCustomLevel, setIsCustomLevel] = useState(false);
  const [customInputText, setCustomInputText] = useState('');
  const [isParsingCustom, setIsParsingCustom] = useState(false);

  const drawingCanvasApiRef = useRef<DrawingCanvasApiRef>(null);

  const [selectedPenColor, setSelectedPenColor] = useState<string>('#4299E1'); // Default blue-500
  const [selectedTool, setSelectedTool] = useState<'pen' | 'eraser'>('pen');

  const [isCurrentWordHard, setIsCurrentWordHard] = useState(false);

  const penColors = [
    { name: 'Xanh', hex: '#4299E1' },    // Blue-500
    { name: 'Đỏ', hex: '#EF4444' },      // Red-500
    { name: 'Cam', hex: '#F97316' },     // Orange-500
    { name: 'Xanh lá đậm', hex: '#16a34a' }, // Green-600
    { name: 'Hồng cánh sen', hex: '#EC4899' }, // Pink-500
    { name: 'Nâu', hex: '#8b4513' },       // SaddleBrown
    { name: 'Cyan', hex: '#06B6D4' },    // Cyan-500
  ];

  const [isFullScreen, setIsFullScreen] = useState(false);
  const practiceAreaRef = useRef<HTMLDivElement>(null); // Ref for the main practice area container


  // Full-screen logic
  const toggleFullScreen = () => {
    if (practiceAreaRef.current) {
      if (!document.fullscreenElement) {
        practiceAreaRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);


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
      setCurrentHSKData({ level: 'CUSTOM', label: 'Tự chọn', words: customWords });
      setDynamicWordRanges([{ start: 1, end: customWords.length, label: 'Tất cả từ tự chọn' }]);
      setSelectedMode(PracticeMode.VIETNAMESE_ONLY); // Force Vietnamese Only for Custom
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
        if (hardWordsForLevel.length > 0) {
          setDynamicWordRanges([
            { start: -1, end: -1, label: `Ôn tập từ khó (${hardWordsForLevel.length})` },
            ...baseRanges
          ]);
        } else {
          setDynamicWordRanges(baseRanges);
        }
      } else {
        setDynamicWordRanges([]);
      }
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
    if (drawingCanvasApiRef.current) {
      drawingCanvasApiRef.current.clear();
    }
  }, [selectedHSKLevel, generateNumericalRanges, generatePinyinRanges]);

  const filterAndPrepareWords = useCallback(() => {
    if (!currentHSKData || !selectedWordRange) return [];

    // Handle special ranges first
    if (selectedWordRange.label.startsWith('Ôn tập từ khó')) {
      return shuffleArray(storageService.getHardWords(currentHSKData.words));
    }
    
    let wordsToFilter = currentHSKData.words;
    if (mandarinFilter.trim() !== '') {
      wordsToFilter = wordsToFilter.filter(word => word.mandarin.startsWith(mandarinFilter.trim()));
    }

    const startIdx = selectedWordRange.start - 1;
    const endIdx = selectedWordRange.end;
    const filteredByRange = wordsToFilter.slice(startIdx, endIdx);
    
    return shuffleArray(filteredByRange);
  }, [currentHSKData, selectedWordRange, mandarinFilter]);

  const handleStartPractice = () => {
    if (!selectedWordRange) {
      setMessage('Vui lòng chọn phạm vi từ vựng để bắt đầu.');
      return;
    }
    if (currentHSKData?.words.length === 0) {
      setMessage('Không có từ vựng cho cấp độ này.');
      return;
    }

    const preparedWords = filterAndPrepareWords();

    if (preparedWords.length === 0) {
      setMessage('Không tìm thấy từ nào phù hợp với lựa chọn của bạn.');
      setPracticeWords([]);
      return;
    }

    setPracticeWords(preparedWords);
    setCurrentWordIndex(0);
    setShowCorrectAnswer(false);
    setUserDrawingDataUrl(null);
    setIsPracticeStarted(true);
    setMessage('');
    if (drawingCanvasApiRef.current) {
      drawingCanvasApiRef.current.clear();
    }
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
        setCurrentHSKData({ level: 'CUSTOM', label: 'Tự chọn', words: parsedWords });
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

  useEffect(() => {
    if (isPracticeStarted && practiceWords.length > 0) {
      const currentWord = practiceWords[currentWordIndex];
      const wordData = storageService.getWordUserData(currentWord);
      setIsCurrentWordHard(wordData?.isHardWord || false);
    }
  }, [isPracticeStarted, practiceWords, currentWordIndex]);

  const handleToggleHardWord = () => {
    const currentWord = practiceWords[currentWordIndex];
    if (!currentWord) return;
    const newIsHard = !isCurrentWordHard;
    storageService.markWordAsHard(currentWord, newIsHard);
    setIsCurrentWordHard(newIsHard);
    setMessage(newIsHard ? 'Đã thêm vào danh sách từ khó.' : 'Đã xóa khỏi danh sách từ khó.');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleShowCorrectAnswer = () => {
    setShowCorrectAnswer(true);
  };

  const handleClearCanvas = () => {
    if (drawingCanvasApiRef.current) {
      drawingCanvasApiRef.current.clear();
    }
    setUserDrawingDataUrl(null); // Clear stored image data
    setShowCorrectAnswer(false); // Hide correct answer when clearing
  };

  const handleUndo = () => {
    if (drawingCanvasApiRef.current) {
      drawingCanvasApiRef.current.undo();
    }
  };

  const handleRedo = () => {
    if (drawingCanvasApiRef.current) {
      drawingCanvasApiRef.current.redo();
    }
  };

  const handlePenColorChange = (hexColor: string) => {
    setSelectedPenColor(hexColor);
    // Always switch to pen tool when a color is chosen
    handleToolChange('pen'); 
  };

  const handleToolChange = (tool: 'pen' | 'eraser') => {
    setSelectedTool(tool);
    if (drawingCanvasApiRef.current) {
      drawingCanvasApiRef.current.setTool(tool);
    }
  };

  const handleNextWord = () => {
    if (currentWordIndex < practiceWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setShowCorrectAnswer(false);
      setUserDrawingDataUrl(null);
      if (drawingCanvasApiRef.current) {
        drawingCanvasApiRef.current.clear();
      }
    } else {
      setMessage('Bạn đã hoàn thành tất cả các từ trong phạm vi này!');
      
      const details: PracticeSessionDetail[] = practiceWords.map(word => ({
        word,
        isCorrect: true, // For handwriting, "correct" means "completed"
      }));

      const session: PracticeSession = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        section: Section.HANDWRITING_PRACTICE,
        mode: 'Chép chính tả',
        hskLevel: selectedHSKLevel,
        wordRangeLabel: selectedWordRange?.label || '',
        score: practiceWords.length,
        total: practiceWords.length,
        details: details,
      };
      storageService.addPracticeSession(session);
      
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
  // Combine conditions for hiding custom range input
  const hideCustomRange = selectedHSKLevel === 'HSK 5' || selectedHSKLevel === 'HSK 6' || selectedHSKLevel === 'TIENG TRUNG 3' || selectedHSKLevel === 'TIENG TRUNG 4';

  // Conditional class names for full screen
  const containerClasses = `
    container mx-auto p-4 md:p-8 bg-blue-100 dark:bg-slate-800 rounded-lg shadow-xl mt-8
    ${isFullScreen ? 'fixed inset-0 z-50 overflow-auto rounded-none bg-blue-50 dark:bg-slate-950 flex flex-col' : 'max-w-5xl'}
  `;

  const wordPromptSectionClasses = `
    bg-blue-200 dark:bg-slate-700 p-6 rounded-lg shadow-inner flex flex-col justify-center min-h-[200px] flex-grow-[0.5]
    ${isFullScreen ? 'flex-grow md:min-h-0' : ''}
  `;
  const mandarinPromptClasses = `
    text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4 text-center
    ${isFullScreen ? 'text-5xl' : ''}
  `;
  const pinyinClasses = `
    text-center ${isFullScreen ? 'text-3xl' : 'text-xl'} text-gray-700 dark:text-gray-300 mb-2
  `;
  const vietnameseClasses = `
    text-center ${isFullScreen ? 'text-3xl' : 'text-xl'} text-gray-700 dark:text-gray-300
  `;
  const drawingCanvasContainerClasses = `
    flex flex-col items-center flex-grow
    ${isFullScreen ? 'flex-grow h-full' : ''}
  `;
  const mandarinAnswerClasses = `font-mandarin text-green-800 dark:text-green-200 ${isFullScreen ? 'text-8xl' : 'text-7xl'}`;


  return (
    <div ref={practiceAreaRef} className={containerClasses}>
      <h2 className={`font-extrabold text-center text-blue-800 dark:text-blue-300 mb-6 ${isFullScreen ? 'text-4xl my-4' : 'text-3xl'}`}>
        Luyện chép chính tả: {currentHSKData.label}
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
              {!isCustomLevel && (
                <button
                  onClick={() => setSelectedMode(PracticeMode.PINYIN_VIETNAMESE)}
                  className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                    selectedMode === PracticeMode.PINYIN_VIETNAMESE
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-green-100 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  Pinyin & Nghĩa tiếng Việt
                </button>
              )}
              <button
                onClick={() => setSelectedMode(PracticeMode.VIETNAMESE_ONLY)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedMode === PracticeMode.VIETNAMESE_ONLY
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-green-100 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                Chỉ nghĩa tiếng Việt
              </button>
            </div>
            {isCustomLevel && <p className="text-center text-sm text-gray-500 mt-2 italic">*Chế độ tự chọn chỉ hỗ trợ "Chỉ nghĩa tiếng Việt"</p>}
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
                      : 'bg-gray-200 text-gray-700 hover:bg-purple-100 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
                  }`}
                  aria-pressed={selectedWordRange?.label === range.label}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {!hideCustomRange && !isCustomLevel && ( // Hide custom range for HSK 5, HSK 6, Tiếng Trung 3, Tiếng Trung 4, and Custom Level
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
                  className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-gray-200 text-center"
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

          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">{hideCustomRange || isCustomLevel ? '3.' : '4.'} Lọc theo chữ Hán (tùy chọn):</h3>
            <input
              type="text"
              value={mandarinFilter}
              onChange={(e) => setMandarinFilter(e.target.value)}
              placeholder="Nhập chữ Hán bắt đầu (ví dụ: 你)"
              className="w-full max-w-xs p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-gray-200 text-center"
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

            <div className={`flex flex-col gap-4 ${isFullScreen ? 'flex-grow items-stretch md:flex-row' : 'md:flex-row md:justify-center md:items-start'}`}>
              {/* LEFT: Drawing Tools (Vertical Palette) */}
              <div className={`flex flex-row flex-wrap justify-center gap-2 p-2 rounded-lg bg-blue-100 dark:bg-slate-700 shadow-md
                ${isFullScreen ? 'md:order-1 flex-shrink-0 md:flex-col md:items-start md:justify-start' : 'md:flex-col md:items-start md:justify-start'}
              `}>
                {/* Full screen button */}
                <button
                  onClick={toggleFullScreen}
                  className="p-2 rounded-full transition-colors duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-600 shadow-md"
                  title={isFullScreen ? "Thoát toàn màn hình (Esc)" : "Toàn màn hình"}
                  aria-label={isFullScreen ? "Thoát toàn màn hình" : "Mở toàn màn hình"}
                >
                  {isFullScreen ? (
                    // Exit Full Screen Icon
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15L3.75 20.25M15 9V4.5M15 9H19.5M15 9L20.25 3.75M15 15v4.5M15 15H19.5M15 15L20.25 20.25" />
                    </svg>
                  ) : (
                    // Full Screen Icon
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 16.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
                    </svg>
                  )}
                </button>
                {/* Pen Tool Button */}
                <button
                  onClick={() => handleToolChange('pen')}
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    selectedTool === 'pen'
                      ? 'bg-blue-500 text-white shadow-md dark:bg-blue-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-600'
                  }`}
                  title="Bút vẽ"
                  aria-label="Chọn công cụ bút vẽ"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                {/* Pen Color Selector */}
                {penColors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => handlePenColorChange(color.hex)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedPenColor === color.hex && selectedTool === 'pen' ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300 dark:border-gray-600'
                    } transition-all duration-150`}
                    style={{ backgroundColor: color.hex }}
                    title={`Màu ${color.name}`}
                    aria-label={`Chọn màu bút ${color.name}`}
                    disabled={selectedTool === 'eraser'} // Disable color selection when eraser is active
                  ></button>
                ))}
                {/* Eraser Tool */}
                <button
                  onClick={() => handleToolChange('eraser')}
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    selectedTool === 'eraser'
                      ? 'bg-red-500 text-white shadow-md dark:bg-red-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-600'
                  }`}
                  title="Tẩy"
                  aria-label="Chọn công cụ tẩy"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* MIDDLE: Word Prompt Section */}
              <div className={`${wordPromptSectionClasses} ${isFullScreen ? 'md:order-2 flex-grow-[0.3]' : ''}`}>
                <h3 className={mandarinPromptClasses}>Hãy viết chữ Hán cho từ này:</h3>
                {selectedMode === PracticeMode.PINYIN_VIETNAMESE && (
                  <p className={pinyinClasses}>
                    <span className="font-semibold">Pinyin:</span> {practiceWords[currentWordIndex].pinyin}
                  </p>
                )}
                <p className={vietnameseClasses}>
                  <span className="font-semibold">Nghĩa Việt:</span> {practiceWords[currentWordIndex].vietnamese}
                </p>
              </div>

              {/* RIGHT: Drawing Canvas */}
              <div className={`${drawingCanvasContainerClasses} ${isFullScreen ? 'md:order-3 md:flex-grow-[2]' : ''}`}>
                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Khung vẽ của bạn</h4>
                <DrawingCanvas
                  ref={drawingCanvasApiRef} // Pass the new ref here
                  width={800} // Base width when not fluid
                  height={450} // Base height when not fluid
                  fluid={isFullScreen} // Pass fluid prop based on full screen state
                  penColor={selectedPenColor}
                  initialTool={selectedTool}
                  className="w-full max-w-xl md:max-w-none border-2 border-dashed border-blue-400 dark:border-blue-600 rounded-md bg-white dark:bg-gray-700 cursor-crosshair touch-none mx-auto"
                  onDrawEnd={handleDrawingEnd}
                />
              </div>
            </div>

            {/* Control Buttons (kept at the bottom, sticky) */}
            <div className={`flex flex-wrap justify-center gap-4 mt-8 py-4 rounded-b-lg shadow-t-lg
                ${isFullScreen ? 'sticky bottom-0 bg-blue-50 dark:bg-slate-950 flex-shrink-0' : 'bg-blue-100 dark:bg-slate-800'}
            `}>
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
                onClick={handleToggleHardWord}
                className={`${
                  isCurrentWordHard
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-orange-500 hover:bg-orange-600'
                } text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-md`}
                aria-label={isCurrentWordHard ? 'Đánh dấu đã nhớ từ này' : 'Đánh dấu chưa nhớ từ này'}
              >
                {isCurrentWordHard ? 'Đã nhớ' : 'Chưa nhớ'}
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
              <div className={`mt-8 p-6 bg-green-50 dark:bg-slate-700 rounded-lg shadow-lg ${isFullScreen ? 'max-w-full' : ''}`}>
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
                    <p className={mandarinAnswerClasses}>{practiceWords[currentWordIndex].mandarin}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
            <div className="text-center p-8 bg-blue-100 dark:bg-slate-800 rounded-lg shadow-xl mt-8 max-w-2xl mx-auto">
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
