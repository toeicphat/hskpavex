
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HSKWord, PracticeSession, PracticeSessionDetail, Section, VocabularyPracticeMode } from '../types';
import { QUIZ_WORD_COUNT, QUIZ_OPTION_COUNT } from '../global-constants';
import * as storageService from '../storageService';

interface QuizPracticeProps {
  words: HSKWord[]; // This is the list for the selected range (can be small, e.g., hard words)
  fullVocabulary: HSKWord[]; // This is the full list for the HSK level (for distractors)
  autoAdvance: boolean;
  onPracticeEnd: (message: string, isFinal: boolean) => void;
  onGoBack: () => void;
  onWordResult: (word: HSKWord, isCorrect: boolean) => void;
  selectedHSKLevel: string;
  wordRangeLabel: string;
}

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

const QuizPractice: React.FC<QuizPracticeProps> = ({ words, fullVocabulary, autoAdvance, onPracticeEnd, onGoBack, onWordResult, selectedHSKLevel, wordRangeLabel }) => {
  const [poolOfAvailableWords, setPoolOfAvailableWords] = useState<HSKWord[]>([]);
  const [currentTurnQuestions, setCurrentTurnQuestions] = useState<HSKWord[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [options, setOptions] = useState<HSKWord[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [currentTurnScore, setCurrentTurnScore] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [practiceCompleted, setPracticeCompleted] = useState<boolean>(false);
  const [isAnswering, setIsAnswering] = useState<boolean>(false);
  const [isTurnComplete, setIsTurnComplete] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const sessionDetailsRef = useRef<PracticeSessionDetail[]>([]);
  const [showPinyin, setShowPinyin] = useState<boolean>(false);
  const isInitialMount = useRef(true);

  const generateQuizTurn = useCallback(() => {
    if (practiceCompleted) return;

    setMessage('');
    setSelectedAnswer(null);
    setFeedback(null);
    setIsTurnComplete(false);
    setCurrentQuestionIndex(0);
    setCurrentTurnScore(0);
    setShowPinyin(false);

    let questionsForThisTurn: HSKWord[] = [];
    let sourcePool: HSKWord[] = poolOfAvailableWords;

    if (sourcePool.length === 0) {
      const finalMessage = `Quiz hoàn thành! Bạn đã đạt ${totalScore} / ${words.length} điểm.`;
      const session: PracticeSession = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        section: Section.VOCABULARY_PRACTICE,
        mode: VocabularyPracticeMode.QUIZ,
        hskLevel: selectedHSKLevel,
        wordRangeLabel: wordRangeLabel,
        score: totalScore,
        total: words.length,
        details: sessionDetailsRef.current,
      };
      storageService.addPracticeSession(session);
      setPracticeCompleted(true);
      onPracticeEnd(finalMessage, true);
      return;
    }

    if (sourcePool.length < QUIZ_WORD_COUNT) {
      questionsForThisTurn = shuffleArray(sourcePool);
      setPoolOfAvailableWords([]);
      if (words.length > QUIZ_WORD_COUNT) { // Only show "Lượt cuối" if we had multiple turns
          setMessage(`Lượt cuối cùng! Chỉ còn ${questionsForThisTurn.length} từ trong phạm vi này.`);
      }
    } else {
      const shuffledCurrentPool = shuffleArray(sourcePool);
      questionsForThisTurn = shuffledCurrentPool.slice(0, QUIZ_WORD_COUNT);
      setPoolOfAvailableWords(shuffledCurrentPool.slice(QUIZ_WORD_COUNT));
    }

    setCurrentTurnQuestions(questionsForThisTurn);

  }, [poolOfAvailableWords, totalScore, words.length, onPracticeEnd, practiceCompleted, selectedHSKLevel, wordRangeLabel]);


  useEffect(() => {
    if (words.length === 0) {
      onPracticeEnd('Không có từ vựng để chơi quiz trong phạm vi đã chọn.', true);
      return;
    }

    // Reset all states for a new practice session
    sessionDetailsRef.current = [];
    setPoolOfAvailableWords(shuffleArray(words));
    setTotalScore(0);
    setPracticeCompleted(false);
    setMessage('');
    setIsTurnComplete(false);
    setCurrentTurnQuestions([]);
    setShowPinyin(false);
    isInitialMount.current = true;
  }, [words, onPracticeEnd]);

  useEffect(() => {
    if (!practiceCompleted && currentTurnQuestions.length === 0 && !isTurnComplete) {
      if (poolOfAvailableWords.length > 0) {
        generateQuizTurn();
      } else if (isInitialMount.current) {
        // Wait for initial setup
      } else {
        generateQuizTurn();
      }
    }
     if (isInitialMount.current) {
        isInitialMount.current = false;
    }
  }, [currentTurnQuestions.length, practiceCompleted, generateQuizTurn, isTurnComplete, poolOfAvailableWords, totalScore, words.length]);


  useEffect(() => {
    if (currentTurnQuestions.length > 0 && currentQuestionIndex < currentTurnQuestions.length && !practiceCompleted && !isTurnComplete) {
      const currentQuestion = currentTurnQuestions[currentQuestionIndex];
      
      // Use fullVocabulary for distractors to allow quizzing even with few words
      const incorrectOptionsPool = fullVocabulary.filter(word => word.mandarin !== currentQuestion.mandarin);
      const shuffledIncorrectOptions = shuffleArray(incorrectOptionsPool);
      const chosenIncorrectOptions = shuffledIncorrectOptions.slice(0, QUIZ_OPTION_COUNT - 1);

      const allOptions = shuffleArray([currentQuestion, ...chosenIncorrectOptions]);
      setOptions(allOptions);

      setSelectedAnswer(null);
      setFeedback(null);
      setIsAnswering(false);
      setShowPinyin(false);
    }
  }, [currentTurnQuestions, currentQuestionIndex, practiceCompleted, fullVocabulary, isTurnComplete]);


  const handleAnswer = (vietnameseMeaning: string) => {
    const currentQuestion = currentTurnQuestions[currentQuestionIndex];
    if (!currentQuestion || isAnswering) return;

    setIsAnswering(true);
    setSelectedAnswer(vietnameseMeaning);
    setShowPinyin(true);

    const isCorrect = vietnameseMeaning === currentQuestion.vietnamese;
    onWordResult(currentQuestion, isCorrect);
    
    sessionDetailsRef.current.push({
      word: currentQuestion,
      isCorrect: isCorrect,
      userAnswer: vietnameseMeaning
    });

    if (isCorrect) {
      setFeedback('correct');
      setCurrentTurnScore(prev => prev + 1);
      setTotalScore(prev => prev + 1);
      setMessage('Chính xác!');
    } else {
      setFeedback('incorrect');
      setMessage('Sai rồi.');
      if (navigator.vibrate) navigator.vibrate(200);
    }

    setTimeout(() => {
        if (autoAdvance) {
            handleNextQuestion();
        } else {
            setIsAnswering(false);
        }
    }, autoAdvance ? 1000 : 500);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setFeedback(null);
    setIsAnswering(false);
    setMessage('');
    setShowPinyin(false);

    if (currentQuestionIndex < currentTurnQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsTurnComplete(true);
      
      if (poolOfAvailableWords.length === 0) {
        generateQuizTurn();
      } else if (autoAdvance) {
        setMessage('Hoàn thành lượt! Bắt đầu lượt mới...');
        setTimeout(() => generateQuizTurn(), 1500);
      } else {
        setMessage(`Hoàn thành lượt! Bạn đã đạt ${currentTurnScore} / ${currentTurnQuestions.length} điểm trong lượt này. Nhấn "Lượt mới" để tiếp tục.`);
      }
    }
  };

  const handleContinueToNextTurn = () => {
    if (poolOfAvailableWords.length > 0) {
      generateQuizTurn();
    }
  };

  const handleRestartPractice = () => {
    if (words.length === 0) {
        onPracticeEnd('Không có từ vựng để chơi quiz trong phạm vi đã chọn.', true);
        return;
    }
    sessionDetailsRef.current = [];
    setPoolOfAvailableWords(shuffleArray(words));
    setTotalScore(0);
    setPracticeCompleted(false);
    setMessage('');
    setIsTurnComplete(false);
    setCurrentTurnQuestions([]);
    setShowPinyin(false);
  };

  // Defensive check for currentQuestion
  const currentQuestion = currentTurnQuestions[currentQuestionIndex];
  if (!currentQuestion && !practiceCompleted && (poolOfAvailableWords.length > 0 || currentTurnQuestions.length === 0)) {
      return <div className="text-center p-8 text-gray-700 dark:text-gray-300">Đang chuẩn bị quiz...</div>;
  }
  
  return (
    <div className="flex flex-col items-center p-4">
      {!practiceCompleted ? (
        <>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            {`Câu hỏi ${currentQuestionIndex + 1} / ${currentTurnQuestions.length} (Tổng: ${totalScore} / ${words.length})`}
          </p>
          <div className="bg-blue-200 dark:bg-slate-700 p-6 rounded-lg shadow-inner mb-6 w-full max-w-md text-center">
            <p className="text-5xl font-bold text-blue-800 dark:text-blue-200 mb-4" lang="zh-Hans">
              {currentQuestion?.mandarin}
            </p>
            {showPinyin ? (
              <p className="text-xl text-gray-700 dark:text-gray-300">
                ({currentQuestion?.pinyin})
              </p>
            ) : (
              <p className="text-xl text-gray-500 dark:text-gray-400 italic">
                (Pinyin ẩn)
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md mb-6">
            {options.map((optionWord, index) => {
              const isCorrectOption = optionWord.vietnamese === currentQuestion?.vietnamese;
              const isSelected = selectedAnswer === optionWord.vietnamese;

              let buttonClasses = `p-3 rounded-lg text-lg text-left transition-all duration-200 shadow-md hover:shadow-lg`;
              let isDisabled = isAnswering || isTurnComplete;

              if (feedback) {
                if (isCorrectOption) {
                  buttonClasses += ` bg-green-500 text-white`;
                } else if (isSelected && !isCorrectOption) {
                  buttonClasses += ` bg-red-500 text-white`;
                } else {
                  buttonClasses += ` bg-blue-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 opacity-70`;
                }
              } else {
                buttonClasses += ` bg-blue-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-slate-600`;
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(optionWord.vietnamese)}
                  disabled={isDisabled}
                  className={`${buttonClasses} disabled:opacity-70 disabled:cursor-not-allowed`}
                  aria-pressed={isSelected}
                  aria-disabled={isDisabled}
                >
                  {optionWord.vietnamese}
                </button>
              );
            })}
          </div>

          {message && (
            <p className={`text-center mb-4 text-lg font-semibold ${feedback === 'correct' ? 'text-green-600' : (feedback === 'incorrect' ? 'text-red-500' : 'text-blue-500')}`}>
              {message}
            </p>
          )}

          {!autoAdvance && !isTurnComplete && feedback && !isAnswering && (
            <button
              onClick={handleNextQuestion}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-300 shadow-md"
              aria-label="Câu hỏi tiếp theo"
            >
              Câu hỏi tiếp theo
            </button>
          )}

          {isTurnComplete && (poolOfAvailableWords.length > 0) && !autoAdvance && (
            <button
              onClick={handleContinueToNextTurn}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-300 shadow-md"
              aria-label="Lượt mới"
            >
              Lượt mới
            </button>
          )}
        </>
      ) : (
        <div className="text-center p-8 bg-blue-100 dark:bg-slate-700 rounded-lg shadow-lg w-full max-w-md">
          <h3 className="text-3xl font-bold text-blue-800 dark:text-blue-200 mb-4">
            Quiz hoàn thành!
          </h3>
          <p className="text-2xl text-gray-700 dark:text-gray-300 mb-4">
            Điểm của bạn: {totalScore} / {words.length}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleRestartPractice}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-300 shadow-md"
              aria-label="Làm lại Quiz"
            >
              Làm lại Quiz
            </button>
            <button
              onClick={onGoBack}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-300 shadow-md"
              aria-label="Quay lại lựa chọn"
            >
              Quay lại lựa chọn
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPractice;
