
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HSKWord } from '../types';
import { LISTEN_AND_SELECT_WORD_COUNT, LISTEN_AND_SELECT_OPTION_COUNT } from '../global-constants';

interface ListenAndSelectPracticeProps {
  words: HSKWord[]; // This is the full list for the selected range (immutable prop)
  autoAdvance: boolean;
  onPracticeEnd: (message: string, isFinal: boolean) => void; // Updated signature
  onGoBack: () => void;
  onWordResult: (word: HSKWord, isCorrect: boolean) => void;
}

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

const ListenAndSelectPractice: React.FC<ListenAndSelectPracticeProps> = ({ words, autoAdvance, onPracticeEnd, onGoBack, onWordResult }) => {
  const [poolOfAvailableWords, setPoolOfAvailableWords] = useState<HSKWord[]>([]); // All words from 'words' prop not yet assigned to a turn
  const [currentTurnWords, setCurrentTurnWords] = useState<HSKWord[]>([]); // Words for the current 10-word turn
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentCorrectWord, setCurrentCorrectWord] = useState<HSKWord | null>(null);
  const [options, setOptions] = useState<HSKWord[]>([]); // 9 options for the current question
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null); // mandarin of selected word
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [currentTurnScore, setCurrentTurnScore] = useState<number>(0); // Score for the current turn
  const [totalScore, setTotalScore] = useState<number>(0); // Total score across all turns
  const [practiceCompleted, setPracticeCompleted] = useState<boolean>(false); // Overall practice completed
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(''); // Fix: Declare message state
  const [awaitingCorrectConfirmation, setAwaitingCorrectConfirmation] = useState<boolean>(false); // If user got it wrong, must pick right one to proceed
  const [isTurnComplete, setIsTurnComplete] = useState<boolean>(false); // Indicates if the current 10-word turn is finished

  // TTS Control States
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.8); // Default rate: 0.8x

  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // Initialize SpeechSynthesis and load voices
  useEffect(() => {
    synthesisRef.current = window.speechSynthesis;

    const loadVoices = () => {
      const allVoices = synthesisRef.current?.getVoices() || [];
      const chineseVoices = allVoices.filter(voice => voice.lang.startsWith('zh-'));
      setVoices(chineseVoices);

      // Set a default Chinese voice if available
      if (chineseVoices.length > 0 && !selectedVoice) {
        // Try to find a common or "good" Chinese voice if possible, otherwise just pick the first
        const defaultVoice = chineseVoices.find(voice => voice.name.includes('Xiao') || voice.name.includes('Ting') || voice.name.includes('Mei') || voice.default) || chineseVoices[0];
        setSelectedVoice(defaultVoice);
      }
    };

    // Voices might not be loaded immediately, listen for 'voiceschanged' event
    if (synthesisRef.current) {
      loadVoices();
      synthesisRef.current.onvoiceschanged = loadVoices;
    }

    return () => {
      if (synthesisRef.current) {
        synthesisRef.current.onvoiceschanged = null;
      }
    };
  }, [selectedVoice]);


  const speakMandarin = useCallback((text: string) => {
    if (!synthesisRef.current || synthesisRef.current.speaking) return;

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN'; // Always try to set language to Chinese, though voice selection is primary
    utterance.rate = speechRate;
    utterance.pitch = 1;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      console.warn("No specific Chinese voice selected, using browser default for zh-CN.");
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = (event) => {
      console.error('SpeechSynthesisUtterance.onerror', event);
      setIsSpeaking(false);
      setMessage('Lỗi phát âm: ' + event.error);
    };

    synthesisRef.current.speak(utterance);
  }, [selectedVoice, speechRate]);


  // --- Turn Management Functions ---

  // Starts a new 10-word turn from the pool of available words
  const startNewTurn = useCallback(() => {
    setMessage('');
    setSelectedOptionId(null);
    setFeedback(null);
    setAwaitingCorrectConfirmation(false);
    setIsTurnComplete(false); // Reset turn complete state
    setCurrentQuestionIndex(0);
    setCurrentTurnScore(0); // Reset score for the current turn

    // Determine words for the next turn
    let nextTurnWords: HSKWord[] = [];
    if (poolOfAvailableWords.length === 0 && currentTurnWords.length === 0) { // All words exhausted from previous turns
        setPracticeCompleted(true);
        onPracticeEnd(`Hoàn thành phần nghe! Bạn đã đạt ${totalScore} / ${words.length} điểm.`, true);
        return;
    } else if (poolOfAvailableWords.length < LISTEN_AND_SELECT_WORD_COUNT && poolOfAvailableWords.length > 0) {
      // Not enough words for a full new turn. Use remaining words to form a final (smaller) turn.
      nextTurnWords = shuffleArray(poolOfAvailableWords);
      setPoolOfAvailableWords([]); // Clear the pool as all remaining are used
      setMessage(`Lượt cuối cùng! Chỉ còn ${nextTurnWords.length} từ trong phạm vi này.`);
    } else if (poolOfAvailableWords.length === 0) {
      // This case should ideally be caught by `poolOfAvailableWords.length === 0` check above,
      // but as a safeguard, if somehow an empty turn is attempted.
      setPracticeCompleted(true);
      onPracticeEnd(`Hoàn thành phần nghe! Bạn đã đạt ${totalScore} / ${words.length} điểm.`, true);
      return;
    } else {
      // Enough words for a full turn
      const shuffledCurrentPool = shuffleArray(poolOfAvailableWords);
      nextTurnWords = shuffledCurrentPool.slice(0, LISTEN_AND_SELECT_WORD_COUNT);
      setPoolOfAvailableWords(shuffledCurrentPool.slice(LISTEN_AND_SELECT_WORD_COUNT)); // Update remaining pool
    }

    setCurrentTurnWords(nextTurnWords);
  }, [poolOfAvailableWords, currentTurnWords.length, totalScore, words.length, onPracticeEnd]);


  // --- Effects ---

  // Initial setup when 'words' prop changes (or component mounts)
  useEffect(() => {
    if (words.length === 0) {
      onPracticeEnd('Không có từ vựng để luyện tập chế độ này. Vui lòng chọn phạm vi từ khác.', true);
      return;
    }

    if (words.length < LISTEN_AND_SELECT_OPTION_COUNT) {
      onPracticeEnd(`Cần ít nhất ${LISTEN_AND_SELECT_OPTION_COUNT} từ để tạo các tùy chọn cho chế độ "Nghe và Chọn Từ". Vui lòng chọn phạm vi từ vựng lớn hơn.`, true);
      return;
    }

    // If we reach here, 'words' has enough words to start.
    setPoolOfAvailableWords(shuffleArray(words)); // Initialize pool with all words
    setTotalScore(0);
    setPracticeCompleted(false);
    setMessage('');
    setCurrentTurnWords([]); // Ensure currentTurnWords is empty to trigger startNewTurn in next effect
    setIsTurnComplete(false);
  }, [words, onPracticeEnd]);

  // Effect to start the first turn or next turn when poolOfAvailableWords is ready
  // and practice is not yet completed.
  useEffect(() => {
    // Only start a new turn if practice is not completed, there are words in the pool,
    // and `currentTurnWords` is empty (meaning a turn just finished or it's the very first start).
    if (!practiceCompleted && (poolOfAvailableWords.length > 0 || currentTurnWords.length > 0) && currentTurnWords.length === 0 && !isTurnComplete) {
        startNewTurn();
    }
  }, [poolOfAvailableWords, currentTurnWords.length, practiceCompleted, startNewTurn, isTurnComplete]);


  // Effect to set up options and speak word for the current question
  useEffect(() => {
    if (currentTurnWords.length > 0 && currentQuestionIndex < currentTurnWords.length && !practiceCompleted && !isTurnComplete) {
      const questionWord = currentTurnWords[currentQuestionIndex];
      setCurrentCorrectWord(questionWord);

      // Generate options: 1 correct + (LISTEN_AND_SELECT_OPTION_COUNT - 1) incorrect
      const incorrectOptionsPool = words.filter(word => word.mandarin !== questionWord.mandarin); // Use the *original full list* for diverse incorrect options
      const shuffledIncorrectOptions = shuffleArray(incorrectOptionsPool);
      const chosenIncorrectOptions = shuffledIncorrectOptions.slice(0, LISTEN_AND_SELECT_OPTION_COUNT - 1);

      const allOptions = shuffleArray([questionWord, ...chosenIncorrectOptions]);
      setOptions(allOptions);

      // Reset feedback and selection for new question
      if (!awaitingCorrectConfirmation) {
        setSelectedOptionId(null);
        setFeedback(null);
        setMessage('');
        speakMandarin(questionWord.mandarin);
      }
    }
  }, [currentTurnWords, currentQuestionIndex, practiceCompleted, words, awaitingCorrectConfirmation, speakMandarin, isTurnComplete]);


  // --- Handlers ---

  const handleOptionClick = (selectedWord: HSKWord) => {
    if (!currentCorrectWord || isSpeaking) return;

    // If awaiting confirmation, only allow clicking the correct answer
    if (awaitingCorrectConfirmation) {
      if (selectedWord.mandarin === currentCorrectWord.mandarin) {
        setAwaitingCorrectConfirmation(false);
        setFeedback('correct'); // Temporarily show correct feedback
        setMessage('Chính xác!');
        // Don't double-count score. It was already marked as incorrect.
        setTimeout(() => handleNextQuestion(), 500); // Shorter delay to proceed
      } else {
        setMessage('Sai rồi. Hãy chọn đáp án đúng để tiếp tục.'); // User still needs to find correct one
        if (navigator.vibrate) navigator.vibrate(100); // Subtle vibration for incorrect confirmation pick
      }
      return;
    }

    // Normal answer attempt
    setSelectedOptionId(selectedWord.mandarin);
    const isCorrect = selectedWord.mandarin === currentCorrectWord.mandarin;
    onWordResult(currentCorrectWord, isCorrect);

    if (isCorrect) {
      setFeedback('correct');
      setCurrentTurnScore(prev => prev + 1);
      setTotalScore(prev => prev + 1);
      setMessage('Chính xác!');

      if (autoAdvance) {
        setTimeout(() => handleNextQuestion(), 1000);
      }
    } else {
      setFeedback('incorrect');
      setMessage('Sai rồi.');
      if (navigator.vibrate && !autoAdvance) { // Vibrate only if not auto-advancing
        navigator.vibrate(200);
      }
      if (autoAdvance) {
        setTimeout(() => handleNextQuestion(), 1000);
      } else {
        setAwaitingCorrectConfirmation(true); // User must click correct answer to proceed
      }
    }
  };


  const handleNextQuestion = () => {
    setSelectedOptionId(null);
    setFeedback(null);
    setMessage('');
    setAwaitingCorrectConfirmation(false);

    if (currentQuestionIndex < currentTurnWords.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Current turn completed
      setIsTurnComplete(true);
      if (poolOfAvailableWords.length === 0) {
        // All words from the initial range have been processed across all turns
        setPracticeCompleted(true);
        onPracticeEnd(`Hoàn thành phần nghe! Bạn đã đạt ${totalScore} / ${words.length} điểm.`, true);
      } else if (autoAdvance) {
        setMessage('Hoàn thành lượt! Bắt đầu lượt mới...');
        setTimeout(() => startNewTurn(), 1500); // Auto-start next turn
      } else {
        setMessage(`Hoàn thành lượt! Bạn đã đạt ${currentTurnScore} / ${currentTurnWords.length} điểm trong lượt này. Nhấn "Lượt mới" để tiếp tục.`);
      }
    }
  };

  const handleContinueToNextTurn = () => {
    if (poolOfAvailableWords.length > 0) {
      startNewTurn();
    }
  };

  const handleRestartPractice = () => {
    // Reset everything to start from the beginning of the initial 'words' prop.
    if (words.length === 0 || words.length < LISTEN_AND_SELECT_OPTION_COUNT) {
        // This case should ideally be prevented by parent, but as a safeguard.
        onPracticeEnd(`Cần ít nhất ${LISTEN_AND_SELECT_OPTION_COUNT} từ để tạo các tùy chọn. Vui lòng chọn phạm vi từ vựng lớn hơn.`, true);
        return; // Prevent further execution if words are insufficient
    }
    setPoolOfAvailableWords(shuffleArray(words)); // Reset the pool
    setTotalScore(0);
    setPracticeCompleted(false);
    setMessage('');
    setIsTurnComplete(false); // Make sure this is reset
    setCurrentTurnWords([]); // Clear to trigger startNewTurn via useEffect
  };

  // Render initial loading or error states
  if (words.length === 0) {
    return (
      <div className="text-center p-8 text-red-500">
        Không có từ vựng để chơi chế độ này trong phạm vi đã chọn.
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

  if (words.length < LISTEN_AND_SELECT_OPTION_COUNT) {
    return (
      <div className="text-center p-8 text-red-500">
        {`Cần ít nhất ${LISTEN_AND_SELECT_OPTION_COUNT} từ để tạo các tùy chọn cho chế độ "Nghe và Chọn Từ". Vui lòng chọn phạm vi từ vựng lớn hơn.`}
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

  if (currentTurnWords.length === 0 && !practiceCompleted) {
    return <div className="text-center p-8 text-gray-700 dark:text-gray-300">Đang chuẩn bị phần nghe...</div>;
  }

  return (
    <div className="flex flex-col items-center p-4">
      {!practiceCompleted ? (
        <>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            Từ {currentQuestionIndex + 1} / {currentTurnWords.length} (Tổng: {totalScore} / {words.length})
          </p>

          <div className="bg-blue-200 dark:bg-slate-700 p-6 rounded-lg shadow-inner mb-6 w-full max-w-md text-center">
            <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4">Nghe và chọn từ đúng:</h3>
            <button
              onClick={() => currentCorrectWord && speakMandarin(currentCorrectWord.mandarin)}
              disabled={isSpeaking || awaitingCorrectConfirmation}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              aria-label="Nghe lại từ"
            >
              {/* Speaker icon from Heroicons */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9.056 9.056 0 010 12.728M16.413 8.337a5.053 5.053 0 010 7.126M13.713 11.036a1.011 1.011 0 010 1.428m-9.547-5.636V7.48c0-.414.336-.75.75-.75h.923c.306 0 .584.19.707.473l3.522 8.567c.123.282.401.472.707.472h.923c.414 0 .75-.336.75-.75v-1.125a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v1.125c0 .414-.336.75-.75.75h-3c-.096 0-.192-.008-.288-.024l-.454.436A.75.75 0 0110 19.5v.75c0 .414-.336.75-.75.75h-.923c-.306 0-.584-.19-.707-.473l-3.522-8.567A.75.75 0 013 10.473V9.375c0-.414.336-.75.75-.75H4.5z" />
              </svg>

              {isSpeaking ? 'Đang phát...' : 'Nghe lại'}
            </button>
            {message && <p className={`mt-4 text-lg font-semibold ${feedback === 'correct' ? 'text-green-600' : (feedback === 'incorrect' ? 'text-red-500' : 'text-blue-500')}`}>{message}</p>}
            
            {/* Voice and Speed Controls */}
            <div className="mt-6 flex flex-col gap-4 items-center">
                <div className="w-full max-w-xs text-left">
                    <label htmlFor="voice-select" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                        Chọn giọng đọc:
                    </label>
                    <select
                        id="voice-select"
                        className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-gray-200"
                        value={selectedVoice?.name || ''}
                        onChange={(e) => {
                            const voice = voices.find(v => v.name === e.target.value);
                            if (voice) setSelectedVoice(voice);
                        }}
                        aria-label="Chọn giọng đọc tiếng Trung"
                        disabled={isSpeaking}
                    >
                        {voices.length === 0 ? (
                            <option value="">Đang tải giọng nói...</option>
                        ) : (
                            voices.map(voice => (
                                <option key={voice.name} value={voice.name}>
                                    {voice.name} ({voice.lang})
                                </option>
                            ))
                        )}
                    </select>
                </div>

                <div className="w-full max-w-xs text-left">
                    <label htmlFor="speech-rate-slider" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                        Tốc độ đọc: {speechRate.toFixed(1)}x
                    </label>
                    <input
                        type="range"
                        id="speech-rate-slider"
                        min="0.5"
                        max="1.5"
                        step="0.1"
                        value={speechRate}
                        onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        aria-label={`Tốc độ đọc hiện tại là ${speechRate.toFixed(1)}x`}
                        disabled={isSpeaking}
                    />
                </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mb-6">
            {options.map((optionWord) => {
              const isCorrectOption = currentCorrectWord?.mandarin === optionWord.mandarin;
              const isSelected = selectedOptionId === optionWord.mandarin;
              let buttonClasses = `p-4 rounded-lg text-center transition-all duration-200 shadow-md hover:shadow-lg flex flex-col justify-center items-center h-full min-h-[120px]`;
              let isDisabled = isSpeaking || (feedback === 'correct' && !autoAdvance) || (awaitingCorrectConfirmation && !isCorrectOption) || isTurnComplete;

              if (feedback) { // Feedback is showing (answer was just given)
                if (isCorrectOption) {
                  buttonClasses += ` bg-green-500 text-white dark:bg-green-700 dark:text-white`;
                } else if (isSelected && !isCorrectOption) {
                  buttonClasses += ` bg-red-500 text-white dark:bg-red-700 dark:text-white`;
                } else {
                  buttonClasses += ` bg-blue-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 opacity-70`;
                }
              } else { // No feedback yet, user is choosing
                buttonClasses += ` bg-blue-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-slate-600`;
                if (isSelected) {
                    buttonClasses += ` ring-2 ring-blue-500 dark:ring-blue-400`;
                }
              }

              // Special styling for correct answer when awaiting confirmation
              if (awaitingCorrectConfirmation && isCorrectOption && !isSelected) {
                buttonClasses += ` ring-2 ring-green-500 dark:ring-green-400 bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200`;
              }


              return (
                <button
                  key={optionWord.mandarin}
                  onClick={() => handleOptionClick(optionWord)}
                  disabled={isDisabled}
                  className={`${buttonClasses} disabled:opacity-70 disabled:cursor-not-allowed`}
                  aria-pressed={isSelected}
                  aria-disabled={isDisabled}
                >
                  <p className="text-4xl font-mandarin font-bold mb-1" lang="zh-Hans">{optionWord.mandarin}</p>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-1">{optionWord.pinyin}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{optionWord.vietnamese}</p>
                </button>
              );
            })}
          </div>

          {isTurnComplete && poolOfAvailableWords.length > 0 && !autoAdvance && (
            <button
              onClick={handleContinueToNextTurn}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-300 shadow-md"
              aria-label="Lượt mới"
            >
              Lượt mới
            </button>
          )}

          {feedback && !autoAdvance && !awaitingCorrectConfirmation && !isTurnComplete && (
            <button
              onClick={handleNextQuestion}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-300 shadow-md"
              aria-label="Câu hỏi tiếp theo"
            >
              Câu hỏi tiếp theo
            </button>
          )}
        </>
      ) : (
        <div className="text-center p-8 bg-blue-100 dark:bg-slate-700 rounded-lg shadow-lg w-full max-w-md">
          <h3 className="text-3xl font-bold text-blue-800 dark:text-blue-200 mb-4">Hoàn thành phần nghe!</h3>
          <p className="text-2xl text-gray-700 dark:text-gray-300 mb-4">
            Điểm của bạn: {totalScore} / {words.length}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleRestartPractice}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-300 shadow-md"
              aria-label="Làm lại phần nghe"
            >
              Làm lại
            </button>
            <button
              onClick={() => onPracticeEnd('Bạn đã dừng luyện tập Nghe và Chọn Từ.', true)}
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

export default ListenAndSelectPractice;
