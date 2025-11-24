

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HSKWord, PracticeSession, PracticeSessionDetail, Section, VocabularyPracticeMode } from '../types';
import { MATCHING_GAME_WORD_COUNT } from '../global-constants';
import * as storageService from '../storageService';

interface MatchingWordsPracticeProps {
  words: HSKWord[]; // This is the full list for the selected range (e.g., 30 words)
  autoAdvance: boolean;
  onPracticeEnd: (message: string, isFinal: boolean) => void; // Updated signature
  onGoBack: () => void;
  onWordResult: (word: HSKWord, isCorrect: boolean) => void;
  selectedHSKLevel: string;
  wordRangeLabel: string;
}

interface MatchingWordItem {
  id: string;
  type: 'mandarin' | 'vietnamese';
  value: string;
  word: HSKWord; // Keep the original HSKWord object
  isMatched: boolean;
}

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

const MatchingWordsPractice: React.FC<MatchingWordsPracticeProps> = ({ words, autoAdvance, onPracticeEnd, onGoBack, onWordResult, selectedHSKLevel, wordRangeLabel }) => {
  // `wordsLeftForTurns` tracks the words not yet used across *all* game turns within the current session.
  const [wordsLeftForTurns, setWordsLeftForTurns] = useState<HSKWord[]>([]);
  // `gameWords` holds the specific 10 words for the *current* game turn.
  const [gameWords, setGameWords] = useState<HSKWord[]>([]);
  const [leftColumn, setLeftColumn] = useState<MatchingWordItem[]>([]);
  const [rightColumn, setRightColumn] = useState<MatchingWordItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // Array of wordIds that have been matched in current game
  const [attempts, setAttempts] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState<string>(''); // Fix: Declare message state
  const [allWordsInSelectedRangeUsed, setAllWordsInSelectedRangeUsed] = useState<boolean>(false);

  const handleFinalPracticeEnd = useCallback(() => {
    const finalMessage = `Tuyệt vời! Bạn đã ghép đúng tất cả các từ trong phạm vi này!`;
    const details: PracticeSessionDetail[] = words.map(word => ({
      word,
      isCorrect: true, // In matching, completion implies correctness for all items
    }));

    const session: PracticeSession = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      section: Section.VOCABULARY_PRACTICE,
      mode: VocabularyPracticeMode.MATCHING_WORDS,
      hskLevel: selectedHSKLevel,
      wordRangeLabel: wordRangeLabel,
      score: words.length,
      total: words.length,
      details: details,
    };
    storageService.addPracticeSession(session);
    onPracticeEnd(finalMessage, true);
  }, [words, selectedHSKLevel, wordRangeLabel, onPracticeEnd]);

  // Function to start a new game turn with a given pool of words
  const startNewGameTurn = useCallback((poolForThisTurn: HSKWord[]) => {
    setMessage('');
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs([]);
    setAttempts(0);
    setScore(0);
    setAllWordsInSelectedRangeUsed(false); // Reset this flag for a new turn setup

    if (poolForThisTurn.length === 0) {
        setGameWords([]);
        setLeftColumn([]);
        setRightColumn([]);
        setAllWordsInSelectedRangeUsed(true);
        handleFinalPracticeEnd(); // Call the centralized end handler
        return;
    }

    const wordsThisTurn = poolForThisTurn.length < MATCHING_GAME_WORD_COUNT 
        ? shuffleArray(poolForThisTurn) 
        : shuffleArray(poolForThisTurn).slice(0, MATCHING_GAME_WORD_COUNT);
    
    setGameWords(wordsThisTurn);

    const mandarinItems: MatchingWordItem[] = wordsThisTurn.map((word, index) => ({
      id: `mandarin-${word.mandarin}-${index}`,
      type: 'mandarin',
      value: word.mandarin,
      word: word,
      isMatched: false,
    }));
    const vietnameseItems: MatchingWordItem[] = wordsThisTurn.map((word, index) => ({
      id: `vietnamese-${word.mandarin}-${index}`,
      type: 'vietnamese',
      value: word.vietnamese,
      word: word,
      isMatched: false,
    }));

    setLeftColumn(shuffleArray(mandarinItems));
    setRightColumn(shuffleArray(vietnameseItems));

    setWordsLeftForTurns(prev => prev.filter(word => !wordsThisTurn.find(w => w.mandarin === word.mandarin)));
    
    if (poolForThisTurn.length < MATCHING_GAME_WORD_COUNT && poolForThisTurn.length > 0) {
        setMessage(`Lượt cuối cùng! Chỉ còn ${poolForThisTurn.length} từ.`);
    }

  }, [handleFinalPracticeEnd]);

  // Effect to initialize `wordsLeftForTurns` and start the first game turn when `words` prop changes
  useEffect(() => {
    if (words.length > 0) {
      setWordsLeftForTurns(words); // Initialize the pool with all words from the selected range
      startNewGameTurn(words); // Start the first turn using all words
    } else {
      // If no words available, clear everything and inform parent
      setGameWords([]);
      setLeftColumn([]);
      setRightColumn([]);
      setAllWordsInSelectedRangeUsed(true);
      onPracticeEnd('Không có từ vựng để chơi ghép từ trong phạm vi đã chọn.', true);
    }
  }, [words, startNewGameTurn, onPracticeEnd]);

  // Effect for auto-advancing or ending practice after a game turn is completed
  useEffect(() => {
    if (matchedPairs.length === gameWords.length && gameWords.length > 0) {
      // A game turn has just been successfully completed.
      if (wordsLeftForTurns.length === 0 && !allWordsInSelectedRangeUsed) { // Check allWordsInSelectedRangeUsed to prevent duplicate call
        setAllWordsInSelectedRangeUsed(true);
        handleFinalPracticeEnd(); // Call the centralized end handler
        setMessage('Bạn đã luyện tập tất cả các từ trong phạm vi này!');
      } else if (autoAdvance) {
        setMessage('Tuyệt vời! Chuẩn bị lượt mới...');
        onPracticeEnd(`Hoàn thành lượt ghép từ. Còn ${wordsLeftForTurns.length} từ còn lại.`, false); // Indicate turn completion, but not final
        setTimeout(() => {
          startNewGameTurn(wordsLeftForTurns); // Start next turn from the remaining pool
        }, 1000); // Shorter delay for auto-advance
      } else {
        setMessage(`Tuyệt vời! Bạn đã ghép đúng tất cả ${gameWords.length} cặp từ! Nhấn "Lượt mới" để tiếp tục với các từ còn lại hoặc "Hoàn thành".`);
        onPracticeEnd(`Hoàn thành lượt ghép từ. Còn ${wordsLeftForTurns.length} từ còn lại.`, false); // Indicate turn completion, but not final
      }
    }
  }, [matchedPairs.length, gameWords.length, autoAdvance, startNewGameTurn, onPracticeEnd, wordsLeftForTurns.length, allWordsInSelectedRangeUsed, handleFinalPracticeEnd]);


  const handleSelect = (item: MatchingWordItem) => {
    if (item.isMatched || allWordsInSelectedRangeUsed) return;

    // If clicking an already selected item on the same side, unselect it
    if (item.type === 'mandarin' && selectedLeft === item.id) {
      setSelectedLeft(null);
      return;
    }
    if (item.type === 'vietnamese' && selectedRight === item.id) {
      setSelectedRight(null);
      return;
    }

    if (item.type === 'mandarin') {
      setSelectedLeft(item.id);
      if (selectedRight) {
        checkMatch(item, rightColumn.find(r => r.id === selectedRight)!);
      }
    } else { // type === 'vietnamese'
      setSelectedRight(item.id);
      if (selectedLeft) {
        checkMatch(leftColumn.find(l => l.id === selectedLeft)!, item);
      }
    }
  };

  const checkMatch = useCallback((mandarinItem: MatchingWordItem, vietnameseItem: MatchingWordItem) => {
    setAttempts(prev => prev + 1);

    if (mandarinItem.word.mandarin === vietnameseItem.word.mandarin) {
      // Match found
      onWordResult(mandarinItem.word, true); // Report correct result
      setMatchedPairs(prev => [...prev, mandarinItem.word.mandarin]);
      setScore(prev => prev + 1);
      setMessage('Ghép đúng!');
      // Update columns to mark as matched immediately
      setLeftColumn(prev => prev.map(item => item.word.mandarin === mandarinItem.word.mandarin ? { ...item, isMatched: true } : item));
      setRightColumn(prev => prev.map(item => item.word.mandarin === vietnameseItem.word.mandarin ? { ...item, isMatched: true } : item));
      
      // Clear selections for the next attempt immediately
      setSelectedLeft(null);
      setSelectedRight(null);
      setTimeout(() => setMessage(''), 500); // Briefly show "Ghép đúng!" message
    } else {
        // Mismatch - we don't call onWordResult with 'false' because the user can try again.
        // The word is only marked incorrect in modes where they have one chance per question.
      setMessage('Ghép sai, thử lại!');
      
      // Clear selections for the next attempt immediately
      setSelectedLeft(null);
      setSelectedRight(null);
      setTimeout(() => setMessage(''), 500); // Briefly show "Ghép sai, thử lại!" message
    }
  }, [onWordResult]);

  // Function to restart the current turn's words
  const handleRestartCurrentTurn = useCallback(() => {
    setMessage('');
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs([]);
    setAttempts(0);
    setScore(0);

    // Re-shuffle and set columns for the *same* gameWords (words for the current turn)
    const mandarinItems: MatchingWordItem[] = gameWords.map((word, index) => ({
      id: `mandarin-${word.mandarin}-${index}`,
      type: 'mandarin',
      value: word.mandarin,
      word: word,
      isMatched: false,
    }));

    const vietnameseItems: MatchingWordItem[] = gameWords.map((word, index) => ({
      id: `vietnamese-${word.mandarin}-${index}`,
      type: 'vietnamese',
      value: word.vietnamese,
      word: word,
      isMatched: false,
    }));

    setLeftColumn(shuffleArray(mandarinItems));
    setRightColumn(shuffleArray(vietnameseItems));
  }, [gameWords]); // Dependency: gameWords for the current turn


  const handleRestartFullPool = () => {
    setWordsLeftForTurns(words); // Reset the pool to the initial full list
    startNewGameTurn(words); // Start a new game with the full initial list
  };

  const handleStartNextTurn = () => {
    startNewGameTurn(wordsLeftForTurns);
  };

  if (words.length === 0) {
    return (
      <div className="text-center p-8 text-red-500">
        Không có từ vựng để chơi ghép từ trong phạm vi đã chọn.
        <div className="mt-4">
          <button
            onClick={onGoBack}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-lg transition-all duration-300"
          >
            Quay lại lựa chọn
          </button>
        </div>
      </div>
    );
  }

  if (gameWords.length === 0 && !allWordsInSelectedRangeUsed) {
      return <div className="text-center p-8 text-gray-700 dark:text-gray-300">Đang chuẩn bị trò chơi ghép từ...</div>;
  }
  
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Ghép từ</h3>
      {message && (
        <p className={`text-center mb-4 text-lg font-semibold ${matchedPairs.length === gameWords.length ? 'text-green-600' : (message.includes('sai') ? 'text-red-500' : 'text-blue-500')}`}>
          {message}
        </p>
      )}
      <div className="flex justify-around w-full max-w-2xl gap-4 mb-6">
        <p className="text-lg text-gray-700 dark:text-gray-300">Đã ghép: {matchedPairs.length} / {gameWords.length}</p>
        <p className="text-lg text-gray-700 dark:text-gray-300">Số lần thử: {attempts}</p>
        {/* <p className="text-lg text-gray-700 dark:text-gray-300">Điểm: {score}</p> */}
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
        {/* Left Column (Mandarin) */}
        <div className="grid grid-cols-1 gap-3">
          {leftColumn.map(item => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              disabled={item.isMatched || allWordsInSelectedRangeUsed || gameWords.length === 0}
              className={`p-3 rounded-lg text-xl font-mandarin transition-all duration-200
                ${item.isMatched
                  ? 'bg-emerald-200 dark:bg-emerald-700 text-emerald-800 dark:text-emerald-200 cursor-not-allowed opacity-70'
                  : selectedLeft === item.id
                    ? 'bg-blue-300 dark:bg-slate-600 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500'
                    : 'bg-blue-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-slate-600'
                }
                shadow-md hover:shadow-lg disabled:opacity-50`}
              aria-pressed={selectedLeft === item.id}
              aria-disabled={item.isMatched || allWordsInSelectedRangeUsed || gameWords.length === 0}
            >
              {item.value}
            </button>
          ))}
        </div>

        {/* Right Column (Vietnamese) */}
        <div className="grid grid-cols-1 gap-3">
          {rightColumn.map(item => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              disabled={item.isMatched || allWordsInSelectedRangeUsed || gameWords.length === 0}
              className={`p-3 rounded-lg text-lg text-left transition-all duration-200
                ${item.isMatched
                  ? 'bg-emerald-200 dark:bg-emerald-700 text-emerald-800 dark:text-emerald-200 cursor-not-allowed opacity-70'
                  : selectedRight === item.id
                    ? 'bg-blue-300 dark:bg-slate-600 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500'
                    : 'bg-blue-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-slate-600'
                }
                shadow-md hover:shadow-lg disabled:opacity-50`}
              aria-pressed={selectedRight === item.id}
              aria-disabled={item.isMatched || allWordsInSelectedRangeUsed || gameWords.length === 0}
            >
              {item.value}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-8 w-full max-w-md">
        {matchedPairs.length < gameWords.length && gameWords.length > 0 && (
          <button
            onClick={handleRestartCurrentTurn}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Chơi lại lượt hiện tại"
          >
            Chơi Lại Lượt Này
          </button>
        )}
        {matchedPairs.length === gameWords.length && !allWordsInSelectedRangeUsed && !autoAdvance && (
          <button
            onClick={handleStartNextTurn}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            aria-label="Bắt đầu lượt mới"
          >
            Bắt đầu Lượt Mới
          </button>
        )}
        {allWordsInSelectedRangeUsed && words.length > 0 && (
          <button
            onClick={handleRestartFullPool}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            aria-label="Chơi lại toàn bộ cấp độ"
          >
            Chơi lại toàn bộ
          </button>
        )}
        <button
          onClick={() => onPracticeEnd('Bạn đã dừng luyện tập ghép từ.', true)}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          aria-label="Hoàn thành"
        >
          Hoàn thành
        </button>
      </div>
    </div>
  );
};

export default MatchingWordsPractice;