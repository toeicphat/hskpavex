
import React, { useState, useEffect, useCallback } from 'react';
import { HSKWord } from '../types';

interface FlashcardPracticeProps {
  words: HSKWord[];
  onPracticeEnd: (message: string) => void;
  onGoBack: () => void;
}

const FlashcardPractice: React.FC<FlashcardPracticeProps> = ({ words, onPracticeEnd, onGoBack }) => {
  const [shuffledWords, setShuffledWords] = useState<HSKWord[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  useEffect(() => {
    if (words.length > 0) {
      handleShuffle();
    }
  }, [words]);

  const handleShuffle = useCallback(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [words]);

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentCardIndex < shuffledWords.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      onPracticeEnd('Bạn đã xem hết tất cả các thẻ từ! Nhấn "Hoàn thành" để quay lại hoặc "Xáo trộn" để luyện tập lại.');
    }
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  if (shuffledWords.length === 0) {
    return (
      <div className="text-center p-8 text-gray-700 dark:text-gray-300">
        Không có từ vựng để luyện tập flashcard. Vui lòng chọn phạm vi từ khác.
      </div>
    );
  }

  const currentWord = shuffledWords[currentCardIndex];

  return (
    <div className="flex flex-col items-center">
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
        Thẻ {currentCardIndex + 1} / {shuffledWords.length}
      </p>

      <div
        className={`flashcard-container relative w-full max-w-sm h-64 md:h-80 perspective-1000 cursor-pointer mb-6`}
        onClick={handleFlip}
        role="button"
        aria-label={`Flashcard: ${isFlipped ? currentWord.pinyin + ' - ' + currentWord.vietnamese : currentWord.mandarin}`}
      >
        <div
          className={`flashcard-inner absolute w-full h-full text-center transition-transform duration-500 transform-style-preserve-3d rounded-lg shadow-xl ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front of the card */}
          <div className="flashcard-front absolute w-full h-full bg-blue-200 dark:bg-slate-700 flex items-center justify-center rounded-lg backface-hidden p-4">
            <p className="text-6xl font-bold text-blue-800 dark:text-blue-200" lang="zh-Hans">
              {currentWord.mandarin}
            </p>
          </div>
          {/* Back of the card */}
          <div className="flashcard-back absolute w-full h-full bg-emerald-200 dark:bg-emerald-700 flex flex-col items-center justify-center rounded-lg backface-hidden rotate-y-180 p-4">
            <p className="text-3xl text-emerald-800 dark:text-emerald-200 mb-2 font-semibold">
              {currentWord.pinyin}
            </p>
            <p className="text-xl text-gray-700 dark:text-gray-300 text-center">
              {currentWord.vietnamese}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-4 w-full max-w-md">
        <button
          onClick={handlePrevious}
          disabled={currentCardIndex === 0}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-gray-100 font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Thẻ trước"
        >
          &larr; Trước
        </button>
        <button
          onClick={handleFlip}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          aria-label="Lật thẻ"
        >
          Lật Thẻ
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          aria-label="Thẻ tiếp theo"
        >
          Tiếp &rarr;
        </button>
        <button
          onClick={handleShuffle}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          aria-label="Xáo trộn thẻ"
        >
          Xáo trộn
        </button>
        <button
          onClick={onGoBack}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Hoàn thành
        </button>
      </div>

      {/* Fix: Removed the `jsx` prop as it's not a standard HTML style attribute */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default FlashcardPractice;