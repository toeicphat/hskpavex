
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HSKWord } from '../types';
import { QUIZ_WORD_COUNT, QUIZ_OPTION_COUNT } from '../global-constants';

interface QuizPracticeProps {
  words: HSKWord[];
  autoAdvance: boolean;
  onPracticeEnd: (message: string) => void;
  onGoBack: () => void;
}

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

const QuizPractice: React.FC<QuizPracticeProps> = ({ words, autoAdvance, onPracticeEnd, onGoBack }) => {
  const [quizQuestions, setQuizQuestions] = useState<HSKWord[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [options, setOptions] = useState<HSKWord[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null); // Stores Vietnamese meaning of the initially selected answer
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [isAnswering, setIsAnswering] = useState<boolean>(false); // To prevent multiple clicks while processing
  const [awaitingCorrectConfirmation, setAwaitingCorrectConfirmation] = useState<boolean>(false); // If user got it wrong, must pick right one to proceed

  const generateQuiz = useCallback(() => {
    if (words.length < QUIZ_OPTION_COUNT || words.length < QUIZ_WORD_COUNT) {
      onPracticeEnd(`Cần ít nhất ${Math.max(QUIZ_OPTION_COUNT, QUIZ_WORD_COUNT)} từ để chơi quiz. Vui lòng chọn phạm vi từ vựng lớn hơn.`);
      return;
    }

    const shuffledWords = shuffleArray(words);
    const selectedQuestions = shuffledWords.slice(0, QUIZ_WORD_COUNT);
    setQuizQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setFeedback(null);
    setSelectedAnswer(null);
    setIsAnswering(false);
    setAwaitingCorrectConfirmation(false);
  }, [words, onPracticeEnd]);

  useEffect(() => {
    generateQuiz();
  }, [generateQuiz]);

  useEffect(() => {
    if (quizQuestions.length > 0 && !quizCompleted) {
      const currentQuestion = quizQuestions[currentQuestionIndex];
      const correctOption = currentQuestion;

      // Get other words for incorrect options from the entire word list,
      // excluding the current correct answer.
      const incorrectOptionsPool = words.filter(word => word.mandarin !== currentQuestion.mandarin);
      const shuffledIncorrectOptions = shuffleArray(incorrectOptionsPool);
      const chosenIncorrectOptions = shuffledIncorrectOptions.slice(0, QUIZ_OPTION_COUNT - 1);

      const allOptions = shuffleArray([correctOption, ...chosenIncorrectOptions]);
      setOptions(allOptions);

      // Reset states for new question if not awaiting confirmation
      if (!awaitingCorrectConfirmation) {
        setSelectedAnswer(null);
        setFeedback(null);
        setIsAnswering(false);
      }
    }
  }, [quizQuestions, currentQuestionIndex, quizCompleted, words, awaitingCorrectConfirmation]);

  const handleAnswer = (vietnameseMeaning: string) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];

    // If already awaiting correct confirmation, only allow clicking the correct answer
    if (awaitingCorrectConfirmation) {
      if (vietnameseMeaning === currentQuestion.vietnamese) {
        setAwaitingCorrectConfirmation(false);
        handleNextQuestion();
      } else {
        // User clicked a wrong answer again while awaiting confirmation for the correct one
        // Give subtle vibration for incorrect choice while awaiting correction
        if (navigator.vibrate) navigator.vibrate(100);
        return;
      }
      return; // Exit after handling confirmation click
    }

    if (isAnswering && !autoAdvance) return; // Prevent re-answering if not auto-advancing

    setIsAnswering(true);
    setSelectedAnswer(vietnameseMeaning);

    if (vietnameseMeaning === currentQuestion.vietnamese) {
      setFeedback('correct');
      setScore(prev => prev + 1);
      if (autoAdvance) {
        setTimeout(() => handleNextQuestion(), 1000); // Auto-advance after 1 second
      } else {
        // If not auto-advancing, the user will see 'Chính xác!' and manually click 'Câu hỏi tiếp theo'
      }
    } else {
      setFeedback('incorrect');
      if (navigator.vibrate && !autoAdvance) { // Vibrate only if not auto-advancing and user needs to correct
        navigator.vibrate(200);
      }
      if (autoAdvance) {
        setTimeout(() => handleNextQuestion(), 1000); // Auto-advance even on wrong answer if enabled
      } else {
        setAwaitingCorrectConfirmation(true); // User must click correct answer to proceed
      }
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setFeedback(null);
    setIsAnswering(false);
    setAwaitingCorrectConfirmation(false);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
      onPracticeEnd(`Quiz hoàn thành! Bạn đã đạt ${score} / ${quizQuestions.length} điểm.`);
    }
  };

  const handleRestartQuiz = () => {
    generateQuiz();
  };

  if (words.length < QUIZ_WORD_COUNT) {
      return (
          <div className="text-center p-8 text-red-500">
              {`Cần ít nhất ${Math.max(QUIZ_OPTION_COUNT, QUIZ_WORD_COUNT)} từ để chơi quiz. Vui lòng chọn phạm vi từ vựng lớn hơn.`}
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

  if (quizQuestions.length === 0 && !quizCompleted) {
      return <div className="text-center p-8 text-gray-700 dark:text-gray-300">Đang chuẩn bị quiz...</div>;
  }
  
  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center p-4">
      {!quizCompleted ? (
        <>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            Câu hỏi {currentQuestionIndex + 1} / {quizQuestions.length}
          </p>
          <div className="bg-blue-200 dark:bg-slate-700 p-6 rounded-lg shadow-inner mb-6 w-full max-w-md text-center">
            <p className="text-5xl font-bold text-blue-800 dark:text-blue-200 mb-4" lang="zh-Hans">
              {currentQuestion?.mandarin}
            </p>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              ({currentQuestion?.pinyin})
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md mb-6">
            {options.map((optionWord, index) => {
              const isCorrectOption = optionWord.vietnamese === currentQuestion.vietnamese;
              const isSelected = selectedAnswer === optionWord.vietnamese;
              const isInitiallyWrongAndSelected = isSelected && !isCorrectOption && feedback === 'incorrect';

              let buttonClasses = `p-3 rounded-lg text-lg text-left transition-all duration-200 shadow-md hover:shadow-lg`;
              let isDisabled = false;

              if (awaitingCorrectConfirmation) {
                // If awaiting confirmation, only the correct option is enabled and highlighted
                isDisabled = !isCorrectOption;
                buttonClasses += isCorrectOption ? 
                  ` bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200 ring-2 ring-green-500 dark:ring-green-400` :
                  ` bg-blue-100 text-gray-500 dark:bg-slate-700 dark:text-gray-400 cursor-not-allowed opacity-70`;
              } else if (feedback) { // Feedback is showing (answer was just given)
                isDisabled = !autoAdvance; // Disable if not auto-advancing
                if (isCorrectOption) {
                  buttonClasses += ` bg-green-500 text-white`;
                } else if (isSelected && !isCorrectOption) {
                  buttonClasses += ` bg-red-500 text-white`;
                } else {
                  buttonClasses += ` bg-blue-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 opacity-70`;
                }
              } else { // No feedback yet, user is choosing
                buttonClasses += ` bg-blue-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-slate-600`;
                isDisabled = isAnswering; // Disable while processing first answer
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

          {feedback && !autoAdvance && (
            <div className="text-center mb-4">
              <p className={`text-xl font-semibold ${feedback === 'correct' ? 'text-green-600' : 'text-red-500'} mb-2`}>
                {feedback === 'correct' ? 'Chính xác!' : 'Sai rồi.'}
              </p>
              {awaitingCorrectConfirmation ? (
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  Hãy nhấn vào đáp án đúng để ghi nhớ và chuyển sang từ tiếp theo
                </p>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-300 shadow-md"
                  aria-label="Câu hỏi tiếp theo"
                >
                  Câu hỏi tiếp theo
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center p-8 bg-blue-100 dark:bg-slate-700 rounded-lg shadow-lg w-full max-w-md">
          <h3 className="text-3xl font-bold text-blue-800 dark:text-blue-200 mb-4">Quiz hoàn thành!</h3>
          <p className="text-2xl text-gray-700 dark:text-gray-300 mb-4">
            Điểm của bạn: {score} / {quizQuestions.length}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleRestartQuiz}
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
