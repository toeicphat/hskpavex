
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HSKWord } from '../types';
import { QUIZ_WORD_COUNT, QUIZ_OPTION_COUNT } from '../global-constants';

interface QuizPracticeProps {
  words: HSKWord[]; // This is the full list for the selected range (immutable prop)
  autoAdvance: boolean;
  onPracticeEnd: (message: string, isFinal: boolean) => void; // Updated signature
  onGoBack: () => void;
  onWordResult: (word: HSKWord, isCorrect: boolean) => void;
}

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

const QuizPractice: React.FC<QuizPracticeProps> = ({ words, autoAdvance, onPracticeEnd, onGoBack, onWordResult }) => {
  const [poolOfAvailableWords, setPoolOfAvailableWords] = useState<HSKWord[]>([]); // All words from 'words' prop not yet assigned to a turn
  const [currentTurnQuestions, setCurrentTurnQuestions] = useState<HSKWord[]>([]); // Questions for the current 10-word turn
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [options, setOptions] = useState<HSKWord[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null); // Stores Vietnamese meaning of the initially selected answer
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [currentTurnScore, setCurrentTurnScore] = useState<number>(0); // Score for the current turn
  const [totalScore, setTotalScore] = useState<number>(0); // Total score across all turns
  const [practiceCompleted, setPracticeCompleted] = useState<boolean>(false); // Overall practice completed
  const [isAnswering, setIsAnswering] = useState<boolean>(false); // To prevent multiple clicks while processing
  const [isTurnComplete, setIsTurnComplete] = useState<boolean>(false); // Indicates if the current 10-question turn is finished
  // Fix: Declare message state
  const [message, setMessage] = useState<string>('');

  // State for Pinyin hiding
  const [showPinyin, setShowPinyin] = useState<boolean>(false);

  const isInitialMount = useRef(true); // Ref to track initial mount for useEffects

  // Generates questions for a single turn from the `poolOfAvailableWords`
  const generateQuizTurn = useCallback(() => {
    if (practiceCompleted) return; // Prevent generating if practice is already completed

    setMessage('');
    setSelectedAnswer(null);
    setFeedback(null);
    setIsTurnComplete(false); // Reset turn complete state for a new turn
    setCurrentQuestionIndex(0);
    setCurrentTurnScore(0); // Reset score for the current turn
    setShowPinyin(false); // Hide Pinyin for new question

    let questionsForThisTurn: HSKWord[] = [];
    let sourcePool: HSKWord[] = poolOfAvailableWords; // Always draw from the main pool

    if (sourcePool.length === 0) {
      setPracticeCompleted(true);
      onPracticeEnd(`Quiz hoàn thành! Bạn đã đạt ${totalScore} / ${words.length} điểm.`, true);
      return;
    }

    // Populate questions for this turn
    if (sourcePool.length < QUIZ_WORD_COUNT) {
      questionsForThisTurn = shuffleArray(sourcePool);
      setPoolOfAvailableWords([]); // Mark all as used from the pool
      setMessage(`Lượt cuối cùng! Chỉ còn ${questionsForThisTurn.length} từ trong phạm vi này.`);
    } else {
      const shuffledCurrentPool = shuffleArray(sourcePool);
      questionsForThisTurn = shuffledCurrentPool.slice(0, QUIZ_WORD_COUNT);
      setPoolOfAvailableWords(shuffledCurrentPool.slice(QUIZ_WORD_COUNT)); // Update remaining pool
    }

    setCurrentTurnQuestions(questionsForThisTurn);

  }, [poolOfAvailableWords, totalScore, words.length, onPracticeEnd, practiceCompleted]);


  // Initial setup when 'words' prop changes (or component mounts)
  useEffect(() => {
    if (words.length === 0) {
      onPracticeEnd('Không có từ vựng để chơi quiz trong phạm vi đã chọn.', true);
      return;
    }

    if (words.length < QUIZ_OPTION_COUNT) {
        onPracticeEnd(`Cần ít nhất ${QUIZ_OPTION_COUNT} từ để tạo các tùy chọn cho quiz. Vui lòng chọn phạm vi từ vựng lớn hơn.`, true);
        return;
    }

    // Reset all states for a new practice session
    setPoolOfAvailableWords(shuffleArray(words)); // Initialize pool with all words
    setTotalScore(0);
    setPracticeCompleted(false);
    setMessage('');
    setIsTurnComplete(false);
    setCurrentTurnQuestions([]); // Clear to ensure generateQuizTurn is called
    setShowPinyin(false);
    isInitialMount.current = true; // Reset initial mount ref
  }, [words, onPracticeEnd]);

  // Effect to start the first turn or next turn when poolOfAvailableWords is ready
  useEffect(() => {
    if (!practiceCompleted && currentTurnQuestions.length === 0 && !isTurnComplete) {
      // Ensure there are words to form a turn before attempting to generate.
      if (poolOfAvailableWords.length > 0) {
        generateQuizTurn();
      } else if (isInitialMount.current) {
        // If it's initial mount and no words in pool (shouldn't happen if `words` prop is valid),
        // or if `words` length check failed.
        // This block primarily prevents `generateQuizTurn` if initial conditions aren't met
        // (e.g., words.length < QUIZ_OPTION_COUNT) and `onPracticeEnd` has already been called.
      } else {
        // All words covered.
        setPracticeCompleted(true);
        onPracticeEnd(`Quiz hoàn thành! Bạn đã đạt ${totalScore} / ${words.length} điểm.`, true);
      }
    }
     // After initial mount, set the ref to false
     if (isInitialMount.current) {
        isInitialMount.current = false;
    }
  }, [currentTurnQuestions.length, practiceCompleted, generateQuizTurn, isTurnComplete, poolOfAvailableWords, totalScore, words.length]);


  // Effect to set up options for the current question
  useEffect(() => {
    if (currentTurnQuestions.length > 0 && currentQuestionIndex < currentTurnQuestions.length && !practiceCompleted && !isTurnComplete) {
      const currentQuestion = currentTurnQuestions[currentQuestionIndex];
      // Get other words for incorrect options from the entire word list,
      // excluding the current correct answer.
      const incorrectOptionsPool = words.filter(word => word.mandarin !== currentQuestion.mandarin);
      const shuffledIncorrectOptions = shuffleArray(incorrectOptionsPool);
      const chosenIncorrectOptions = shuffledIncorrectOptions.slice(0, QUIZ_OPTION_COUNT - 1);

      const allOptions = shuffleArray([currentQuestion, ...chosenIncorrectOptions]);
      setOptions(allOptions);

      // Reset states for new question
      setSelectedAnswer(null);
      setFeedback(null);
      setIsAnswering(false);
      setShowPinyin(false); // Ensure pinyin is hidden for a new question
    }
  }, [currentTurnQuestions, currentQuestionIndex, practiceCompleted, words, isTurnComplete]);


  const handleAnswer = (vietnameseMeaning: string) => {
    const currentQuestion = currentTurnQuestions[currentQuestionIndex];
    if (!currentQuestion || isAnswering) return; // Defensive check against undefined currentQuestion or multiple clicks

    setIsAnswering(true);
    setSelectedAnswer(vietnameseMeaning);
    setShowPinyin(true); // Reveal Pinyin after user answers

    const isCorrect = vietnameseMeaning === currentQuestion.vietnamese;
    onWordResult(currentQuestion, isCorrect);

    if (isCorrect) {
      setFeedback('correct');
      setCurrentTurnScore(prev => prev + 1);
      setTotalScore(prev => prev + 1);
      setMessage('Chính xác!');
    } else {
      setFeedback('incorrect');
      setMessage('Sai rồi.');
      if (navigator.vibrate) navigator.vibrate(200); // Vibrate on incorrect answer
    }

    // Auto-advance or allow manual advance after a brief delay for feedback
    setTimeout(() => {
        if (autoAdvance) {
            handleNextQuestion();
        } else {
            setIsAnswering(false); // Allow next question button to be clicked
        }
    }, autoAdvance ? 1000 : 500); // Shorter delay if manual advance
  };

  const handleNextQuestion = () => {
    // Reset for the next question
    setSelectedAnswer(null);
    setFeedback(null);
    setIsAnswering(false);
    setMessage('');
    setShowPinyin(false); // Hide Pinyin for the new question

    if (currentQuestionIndex < currentTurnQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Current turn completed
      setIsTurnComplete(true);
      let finalMessage = '';
      let isFinalPractice = false;

      // Logic to decide next step after a turn
      if (poolOfAvailableWords.length === 0) {
        // All words from the initial selection (prop `words`) have now been used across all turns.
        finalMessage = `Tuyệt vời! Bạn đã hoàn thành tất cả các từ trong phạm vi này! Bạn đã đạt ${totalScore} / ${words.length} điểm.`;
        setMessage(finalMessage);
        setPracticeCompleted(true);
        isFinalPractice = true;
        onPracticeEnd(finalMessage, isFinalPractice);
      } else if (autoAdvance) {
        // More words in pool, and auto-advance is on
        finalMessage = `Hoàn thành lượt! Bắt đầu lượt mới...`;
        setMessage(finalMessage);
        setTimeout(() => generateQuizTurn(), 1500); // Auto-start next turn
      } else {
        // More words in pool, no auto-advance
        finalMessage = `Hoàn thành lượt! Bạn đã đạt ${currentTurnScore} / ${currentTurnQuestions.length} điểm trong lượt này. Nhấn "Lượt mới" để tiếp tục.`;
        setMessage(finalMessage);
      }
    }
  };

  const handleContinueToNextTurn = () => {
    if (poolOfAvailableWords.length > 0) {
      generateQuizTurn();
    }
  };

  const handleRestartPractice = () => {
    // Reset everything to start from the beginning of the initial 'words' prop.
    if (words.length === 0 || words.length < QUIZ_OPTION_COUNT) {
        onPracticeEnd(`Cần ít nhất ${QUIZ_OPTION_COUNT} từ để tạo các tùy chọn. Vui lòng chọn phạm vi từ vựng lớn hơn.`, true);
        return;
    }
    setPoolOfAvailableWords(shuffleArray(words)); // Reset the pool to original words
    setTotalScore(0);
    setPracticeCompleted(false);
    setMessage('');
    setIsTurnComplete(false);
    setCurrentTurnQuestions([]); // Clear to trigger generateQuizTurn via useEffect
    setShowPinyin(false);
  };


  if (words.length < QUIZ_OPTION_COUNT) {
      return (
          <div className="text-center p-8 text-red-500">
              {`Cần ít nhất ${QUIZ_OPTION_COUNT} từ để chơi quiz. Vui lòng chọn phạm vi từ vựng lớn hơn.`}
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

  // Defensive check for currentQuestion to prevent TypeError
  const currentQuestion = currentTurnQuestions[currentQuestionIndex];
  if (!currentQuestion && !practiceCompleted && (poolOfAvailableWords.length > 0 || currentTurnQuestions.length === 0)) { // Add currentTurnQuestions.length === 0 for initial load
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
              let isDisabled = isAnswering || isTurnComplete; // Disable all options while processing first answer or if turn is complete

              if (feedback) { // Feedback is showing (answer was just given)
                if (isCorrectOption) {
                  buttonClasses += ` bg-green-500 text-white`;
                } else if (isSelected && !isCorrectOption) {
                  buttonClasses += ` bg-red-500 text-white`;
                } else {
                  buttonClasses += ` bg-blue-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 opacity-70`;
                }
              } else { // No feedback yet, user is choosing
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

          {message && ( // Show general messages here
            <p className={`text-center mb-4 text-lg font-semibold ${feedback === 'correct' ? 'text-green-600' : (feedback === 'incorrect' ? 'text-red-500' : 'text-blue-500')}`}>
              {message}
            </p>
          )}

          {/* Buttons for navigation */}
          {!autoAdvance && !isTurnComplete && feedback && !isAnswering && ( // Show "Next Question" after answer if not auto-advancing
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
