

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HSKWord, DifficultyLevel } from '../types';
import {
  FILL_IN_THE_BLANKS_WORD_COUNT,
  FILL_IN_THE_BLANKS_OPTION_COUNT,
  HSK_DIFFICULTY_DISTRIBUTIONS,
  DIFFICULTY_LEVEL_MAP,
  DIFFICULTY_INDEX_TO_LEVEL_MAP,
} from '../global-constants';
import { GoogleGenAI, Type } from "@google/genai";
import { LoadingIcon } from './icons';

interface FillInTheBlanksPracticeProps {
  words: HSKWord[]; // This is the full list for the selected range (immutable prop)
  selectedHSKLevel: string; // The currently selected HSK level from parent
  selectedUserDifficulty: DifficultyLevel; // User's overall difficulty bias from parent
  autoAdvance: boolean;
  onPracticeEnd: (message: string, isFinal: boolean) => void;
  onGoBack: () => void;
}

// Interface for individual question state within a turn
interface QuestionState {
  id: string; // Unique ID for keying in lists
  word: HSKWord; // The correct word for this question
  sentence: string | null; // The generated sentence with a blank
  options: HSKWord[]; // The multiple-choice options
  selectedAnswerMandarin: string | null; // The mandarin of the user's selected option
  feedback: 'correct' | 'incorrect' | null; // Feedback for this specific question
  isCorrectlyAnswered: boolean; // True if the user has correctly answered this question
}

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

const FillInTheBlanksPractice: React.FC<FillInTheBlanksPracticeProps> = ({ words, selectedHSKLevel, selectedUserDifficulty, autoAdvance, onPracticeEnd, onGoBack }) => {
  const [poolOfAvailableWords, setPoolOfAvailableWords] = useState<HSKWord[]>([]);
  const [currentTurnQuestionsData, setCurrentTurnQuestionsData] = useState<QuestionState[]>([]);
  const [currentTurnNumber, setCurrentTurnNumber] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [practiceCompleted, setPracticeCompleted] = useState<boolean>(false);
  const [isLoadingSentences, setIsLoadingSentences] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const isInitialMount = useRef(true);

  // Function to generate a Chinese sentence with a blank using Gemini API, adjusted by difficulty
  const generateChineseSentence = useCallback(async (word: HSKWord, targetDifficulty: DifficultyLevel): Promise<string | null> => {
    // Instantiate GoogleGenAI right before making the API call
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY
});
    let generatedSentence: { sentence: string; correct_word: string } | null = null;
    let difficultyGuidance = '';

    switch (targetDifficulty) {
      case DifficultyLevel.EASY:
        difficultyGuidance = "**EASY:** Use simple sentence structures and common vocabulary. The context for the blank should be very obvious and direct. Example: The sentence should be easy to understand for a beginner, clearly pointing to the missing word.";
        break;
      case DifficultyLevel.MEDIUM:
        difficultyGuidance = "**MEDIUM:** Use slightly more complex grammatical structures or less common but still HSK-appropriate vocabulary. The context might require a bit more thought. Example: The sentence might have a slightly longer structure or use a common collocation where the blank fits well, but isn't immediately obvious.";
        break;
      case DifficultyLevel.HARD:
        difficultyGuidance = "**HARD:** Use complex sentence structures, more advanced HSK vocabulary, or require nuanced understanding of the context. The blank should challenge a higher-level learner. Example: The sentence might use a more idiomatic expression, a longer clause structure, or a word that requires understanding a subtle nuance of the context to fill correctly.";
        break;
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are an AI assistant for Chinese language learners. Your task is to create fill-in-the-blank sentences based on a given word and difficulty level.
**Instructions:**
1.  Create a single, grammatically correct Chinese sentence.
2.  The sentence MUST naturally and uniquely use the provided word. This means only the provided word should fit the blank perfectly.
3.  Replace ONLY the target word with five underscore characters "_____" (no spaces) to create the blank. Ensure there are exactly five underscores.
4.  The entire sentence must be in Chinese characters, with no Pinyin or Vietnamese.
5.  Output must be in JSON format: \`{"sentence": "你的句子。", "correct_word": "正确词"}\`. Do not include any other text or explanation in the output.

**Difficulty Guidance for the sentence:**
${difficultyGuidance}

**Example for a word like "三" (three) with EASY difficulty:**
Input: {"word": "三", "difficulty": "EASY"}
Output: {"sentence": "我家有_____口人，我妈妈、我爸爸和我。", "correct_word": "三"}

**Example for a word like "电脑" (computer) with MEDIUM difficulty:**
Input: {"word": "电脑", "difficulty": "MEDIUM"}
Output: {"sentence": "他每天晚上都用_____查资料、看电影。", "correct_word": "电脑"}

**Example for a word like "懒惰" (lazy) with HARD difficulty:**
Input: {"word": "懒惰", "difficulty": "HARD"}
Output: {"sentence": "因为他太_____了，所以老板决定解雇他。", "correct_word": "懒惰"}

Now, generate a sentence for the word: "${word.mandarin}" with difficulty: "${targetDifficulty}".`,
            config: {
                systemInstruction: "You are a helpful AI assistant specialized in creating Chinese language fill-in-the-blank exercises. Provide only the requested JSON output.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        sentence: { type: Type.STRING, description: "Chinese sentence with one blank ('_____') replacing the correct word." },
                        correct_word: { type: Type.STRING, description: "The correct Chinese word that should fill the blank. This should match the input word." },
                    },
                    required: ["sentence", "correct_word"],
                },
            },
        });

        const text = response.text?.trim();
        if (!text) {
            console.warn("Gemini API returned an empty response text for word:", word.mandarin);
            return null;
        }

        try {
            const parsedResponse = JSON.parse(text);
            // Ensure the blank is exactly five underscores, and correct_word matches
            if (parsedResponse.sentence && parsedResponse.correct_word === word.mandarin) {
                const correctedSentence = parsedResponse.sentence.replace(/_+/g, '_____'); // Ensure exactly five underscores
                generatedSentence = { sentence: correctedSentence, correct_word: word.mandarin };
            } else {
                console.warn(`Gemini API returned unexpected JSON for word "${word.mandarin}". Expected correct_word "${word.mandarin}", got "${parsedResponse.correct_word}". Raw text:`, text);
                // If correct_word doesn't match or sentence is malformed, but a blank exists, salvage if possible
                if (parsedResponse.sentence && parsedResponse.sentence.includes('_')) {
                    const correctedSentence = parsedResponse.sentence.replace(/_+/g, '_____');
                    generatedSentence = { sentence: correctedSentence, correct_word: word.mandarin }; // Assume the input word is the correct word
                } else {
                    return null; // Still unable to get a usable sentence
                }
            }
        } catch (jsonError) {
            console.error("Failed to parse JSON from Gemini API:", jsonError, "Raw text:", text);
            return null;
        }
    } catch (error: any) {
        console.error("Error calling Gemini API for word:", word.mandarin, error);
        if (error.message && error.message.includes("Requested entity was not found.")) {
             setMessage("Lỗi API: Không tìm thấy khóa API. Vui lòng chọn lại khóa API của bạn.");
        } else if (error.message) {
            setMessage(`Lỗi khi tạo câu hỏi cho từ "${word.mandarin}": ${error.message}. Vui lòng thử lại.`);
        } else {
            setMessage("Lỗi không xác định khi tạo câu hỏi. Vui lòng thử lại.");
        }
        return null;
    }
    return generatedSentence?.sentence || null;
  }, []);

  const generateOptions = useCallback((correctWord: HSKWord, allWords: HSKWord[]): HSKWord[] => {
    const incorrectOptionsPool = allWords.filter(w => w.mandarin !== correctWord.mandarin);
    const shuffledIncorrectOptions = shuffleArray(incorrectOptionsPool);
    const chosenIncorrectOptions = shuffledIncorrectOptions.slice(0, FILL_IN_THE_BLANKS_OPTION_COUNT - 1);
    return shuffleArray([correctWord, ...chosenIncorrectOptions]);
  }, []);

  const startNewTurn = useCallback(async (wordsForThisTurnPool: HSKWord[]) => {
    setMessage('');
    setIsLoadingSentences(true);
    setCurrentTurnQuestionsData([]); // Clear previous turn's data

    if (wordsForThisTurnPool.length === 0) {
        setPracticeCompleted(true);
        onPracticeEnd(`Hoàn thành phần điền từ! Bạn đã đạt ${totalScore} / ${words.length} điểm.`, true);
        setIsLoadingSentences(false);
        return;
    }

    let wordsForCurrentTurn: HSKWord[] = [];
    if (wordsForThisTurnPool.length < FILL_IN_THE_BLANKS_WORD_COUNT) {
      wordsForCurrentTurn = shuffleArray(wordsForThisTurnPool);
      setPoolOfAvailableWords([]); // All remaining words are used
      setMessage(`Lượt cuối cùng! Chỉ còn ${wordsForCurrentTurn.length} từ trong phạm vi này.`);
    } else {
      const shuffledCurrentPool = shuffleArray(wordsForThisTurnPool);
      wordsForCurrentTurn = shuffledCurrentPool.slice(0, FILL_IN_THE_BLANKS_WORD_COUNT);
      setPoolOfAvailableWords(shuffledCurrentPool.slice(FILL_IN_THE_BLANKS_WORD_COUNT));
    }

    // Determine the difficulty distribution for the current HSK level
    const hskDistribution = HSK_DIFFICULTY_DISTRIBUTIONS[selectedHSKLevel];
    if (!hskDistribution) {
        console.error(`No difficulty distribution found for HSK level: ${selectedHSKLevel}`);
        setMessage('Không thể xác định độ khó cho cấp độ HSK này.');
        setIsLoadingSentences(false);
        setPracticeCompleted(true);
        onPracticeEnd('Lỗi cài đặt độ khó.', true);
        return;
    }

    // Create an array of base difficulties for the 10 questions
    const baseDifficultiesForSlots: DifficultyLevel[] = [];
    for (let i = 0; i < hskDistribution.easy; i++) baseDifficultiesForSlots.push(DifficultyLevel.EASY);
    for (let i = 0; i < hskDistribution.medium; i++) baseDifficultiesForSlots.push(DifficultyLevel.MEDIUM);
    for (let i = 0; i < hskDistribution.hard; i++) baseDifficultiesForSlots.push(DifficultyLevel.HARD);
    shuffleArray(baseDifficultiesForSlots); // Randomize the order of difficulty slots

    // Calculate user bias
    const userBiasIndex = DIFFICULTY_LEVEL_MAP[selectedUserDifficulty] - DIFFICULTY_LEVEL_MAP[DifficultyLevel.MEDIUM]; // -1, 0, or 1

    const newQuestions: QuestionState[] = await Promise.all(
      wordsForCurrentTurn.map(async (word, index) => {
        // Determine the base difficulty for this slot from the shuffled array
        const baseDifficultyForSlot = baseDifficultiesForSlots[index];
        // Calculate the effective difficulty for Gemini
        let effectiveDifficultyIndex = DIFFICULTY_LEVEL_MAP[baseDifficultyForSlot] + userBiasIndex;
        effectiveDifficultyIndex = Math.max(0, Math.min(2, effectiveDifficultyIndex)); // Clamp to [0, 2]
        const targetDifficultyLevel = DIFFICULTY_INDEX_TO_LEVEL_MAP[effectiveDifficultyIndex];

        const sentence = await generateChineseSentence(word, targetDifficultyLevel);
        const options = generateOptions(word, words); // Use the full 'words' prop for diverse options
        return {
          id: `${word.mandarin}-${currentTurnNumber}-${index}`,
          word,
          sentence,
          options,
          selectedAnswerMandarin: null,
          feedback: null,
          isCorrectlyAnswered: false,
        };
      })
    );

    // Filter out questions where sentence generation failed
    const validQuestions = newQuestions.filter(q => q.sentence !== null && q.options.length > 0);

    if (validQuestions.length === 0) {
      setMessage('Không thể tạo đủ câu hỏi cho lượt này. Vui lòng thử lại hoặc chọn phạm vi từ khác.');
      setIsLoadingSentences(false);
      setPracticeCompleted(true); // End practice if no valid questions can be generated
      onPracticeEnd('Không có câu hỏi hợp lệ nào được tạo ra.', true);
      return;
    }

    setCurrentTurnQuestionsData(validQuestions);
    setCurrentTurnNumber(prev => prev + 1);
    setIsLoadingSentences(false);
    
  }, [generateChineseSentence, generateOptions, onPracticeEnd, totalScore, words, currentTurnNumber, selectedHSKLevel, selectedUserDifficulty]);


  useEffect(() => {
    if (words.length === 0) {
      onPracticeEnd('Không có từ vựng để luyện tập chế độ này. Vui lòng chọn phạm vi từ khác.', true);
      return;
    }

    if (words.length < FILL_IN_THE_BLANKS_OPTION_COUNT) {
      onPracticeEnd(`Cần ít nhất ${FILL_IN_THE_BLANKS_OPTION_COUNT} từ để tạo các tùy chọn cho chế độ "Điền Từ Thích Hợp". Vui lòng chọn phạm vi từ vựng lớn hơn.`, true);
      return;
    }

    setPoolOfAvailableWords(shuffleArray(words));
    setTotalScore(0);
    setPracticeCompleted(false);
    setMessage('');
    setCurrentTurnQuestionsData([]);
    setCurrentTurnNumber(0);
    isInitialMount.current = true; // Mark as initial mount
  }, [words, onPracticeEnd, selectedHSKLevel]); // Include selectedHSKLevel in dependencies

  // This effect is for initiating the *first* turn after initial setup, or subsequent turns
  useEffect(() => {
    // Only attempt to start a turn if:
    // 1. Practice is not completed
    // 2. No questions are currently loading
    // 3. currentTurnQuestionsData is empty (meaning a turn just finished or it's the very first start)
    // 4. There are words available in the pool to create questions
    if (!practiceCompleted && !isLoadingSentences && currentTurnQuestionsData.length === 0 && poolOfAvailableWords.length > 0) {
        startNewTurn(poolOfAvailableWords);
    } else if (!practiceCompleted && !isLoadingSentences && currentTurnQuestionsData.length === 0 && poolOfAvailableWords.length === 0 && !isInitialMount.current) {
        // This case means all words have been exhausted and no new turn can be started
        setPracticeCompleted(true);
        onPracticeEnd(`Hoàn thành phần điền từ! Bạn đã đạt ${totalScore} / ${words.length} điểm.`, true);
    }

    // Reset after first effect run (related to mount, not turn start)
    if (isInitialMount.current) {
        isInitialMount.current = false;
    }
  }, [poolOfAvailableWords, currentTurnQuestionsData.length, practiceCompleted, isLoadingSentences, startNewTurn, words.length, onPracticeEnd, totalScore]);


  const handleOptionClick = useCallback((questionId: string, selectedWord: HSKWord) => {
    setCurrentTurnQuestionsData(prevData => {
      return prevData.map(q => {
        if (q.id === questionId && !q.isCorrectlyAnswered) { // Only allow interaction if not already correctly answered
          const isCorrect = selectedWord.mandarin === q.word.mandarin;
          
          if (isCorrect) {
            // If it was incorrect before, and now correct, still add to total score if not already counted.
            if (q.feedback !== 'correct') { 
                setTotalScore(prev => prev + 1);
            }
            return { ...q, selectedAnswerMandarin: selectedWord.mandarin, feedback: 'correct', isCorrectlyAnswered: true };
          } else {
            if (navigator.vibrate) navigator.vibrate(100);
            return { ...q, selectedAnswerMandarin: selectedWord.mandarin, feedback: 'incorrect' };
          }
        }
        return q;
      });
    });
  }, []);

  const allQuestionsAnsweredCorrectly = currentTurnQuestionsData.length > 0 && currentTurnQuestionsData.every(q => q.isCorrectlyAnswered);

  const handleNextTurn = useCallback(() => {
    setMessage('');
    // Check if there are more words in the pool for the next turn
    if (poolOfAvailableWords.length > 0) {
        startNewTurn(poolOfAvailableWords);
    } else {
        setPracticeCompleted(true);
        onPracticeEnd(`Hoàn thành phần điền từ! Bạn đã đạt ${totalScore} / ${words.length} điểm.`, true);
    }
  }, [poolOfAvailableWords, startNewTurn, onPracticeEnd, totalScore, words.length]);

  const handleRestartPractice = useCallback(() => {
    if (words.length === 0 || words.length < FILL_IN_THE_BLANKS_OPTION_COUNT) {
      onPracticeEnd(`Cần ít nhất ${FILL_IN_THE_BLANKS_OPTION_COUNT} từ để tạo các tùy chọn. Vui lòng chọn phạm vi từ vựng lớn hơn.`, true);
      return;
    }
    setPoolOfAvailableWords(shuffleArray(words));
    setTotalScore(0);
    setPracticeCompleted(false);
    setMessage('');
    setCurrentTurnQuestionsData([]);
    setCurrentTurnNumber(0);
    // When restarting, immediately try to start a new turn.
    // The useEffect will pick this up when currentTurnQuestionsData is empty.
  }, [words, onPracticeEnd]);


  // Handle edge case where initial words array is empty or too small
  if (words.length === 0 || words.length < FILL_IN_THE_BLANKS_OPTION_COUNT) {
    return (
      <div className="text-center p-8 text-red-500">
        <p className="text-xl mb-4">{message || `Cần ít nhất ${FILL_IN_THE_BLANKS_OPTION_COUNT} từ để tạo các tùy chọn cho chế độ "Điền Từ Thích Hợp". Vui lòng chọn phạm vi từ vựng lớn hơn.`}</p>
        <button
          onClick={onGoBack}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-lg transition-all duration-300"
        >
          Quay lại lựa chọn
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4">
      {/* Overall Title and Messages */}
      <h2 className="text-3xl font-extrabold text-center text-blue-800 dark:text-blue-300 mb-6">
        Điền Từ Thích Hợp: {selectedHSKLevel}
      </h2>
      {message && <p className="text-red-500 text-center mb-4">{message}</p>}

      {/* Main content based on loading, completion, or current state */}
      {isLoadingSentences ? (
        <div className="text-center p-8 text-gray-700 dark:text-gray-300 mt-8">
          <LoadingIcon className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-xl">Đang tạo câu hỏi, vui lòng đợi...</p>
        </div>
      ) : practiceCompleted ? (
        // Practice Completed Screen
        <div className="text-center p-8 bg-blue-100 dark:bg-slate-700 rounded-lg shadow-lg w-full max-w-md">
          <h3 className="text-3xl font-bold text-blue-800 dark:text-blue-200 mb-4">Hoàn thành phần điền từ!</h3>
          <p className="text-2xl text-gray-700 dark:text-gray-300 mb-4">
            Điểm của bạn: {totalScore} / {words.length}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleRestartPractice}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-300 shadow-md"
              aria-label="Làm lại phần điền từ"
            >
              Làm lại
            </button>
            <button
              onClick={() => onPracticeEnd('Bạn đã dừng luyện tập Điền Từ Thích Hợp.', true)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-300 shadow-md"
              aria-label="Quay lại lựa chọn"
            >
              Quay lại lựa chọn
            </button>
          </div>
        </div>
      ) : (
        // Questions Display Screen (directly show questions if not loading and not completed)
        <>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Lượt {currentTurnNumber} ({currentTurnQuestionsData.filter(q => q.isCorrectlyAnswered).length} / {currentTurnQuestionsData.length} đúng) (Tổng: {totalScore} / {words.length})
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl mb-8">
              {currentTurnQuestionsData.map((q, qIndex) => (
                <div key={q.id} className="bg-blue-200 dark:bg-slate-700 p-3 rounded-lg shadow-md flex flex-col">
                  {/* Row 1: Question Number */}
                  <h4 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-2">Câu {qIndex + 1}:</h4>
                  
                  {/* Row 2: Sentence with blank */}
                  <p className="text-xl font-mandarin font-bold text-gray-800 dark:text-gray-200 mb-3 text-center" lang="zh-Hans">
                      {q.sentence || "Đang tải câu hỏi..."}
                  </p>
                  
                  {/* Row 3: Options (flex row, wraps) */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {q.options.map((optionWord, optionIndex) => {
                      const isCorrectOption = q.word.mandarin === optionWord.mandarin;
                      const isSelected = q.selectedAnswerMandarin === optionWord.mandarin;
                      let buttonClasses = `flex-1 px-3 py-1.5 rounded-lg text-center transition-all duration-200 shadow-sm whitespace-nowrap min-w-[calc(25%-0.5rem)]`; // min-w for 4 items with gap-2
                      let isDisabled = q.isCorrectlyAnswered; // Disable once correctly answered

                      if (q.feedback) {
                        if (isCorrectOption) {
                          buttonClasses += ` bg-green-500 text-white dark:bg-green-700 dark:text-white`;
                        } else if (isSelected && !isCorrectOption) {
                          buttonClasses += ` bg-red-500 text-white dark:bg-red-700 dark:text-white`;
                        } else {
                          buttonClasses += ` bg-blue-100 dark:bg-slate-600 text-gray-800 dark:text-gray-200 opacity-70`;
                        }
                      } else {
                        buttonClasses += ` bg-blue-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-slate-600`;
                        if (isSelected) {
                          buttonClasses += ` ring-2 ring-blue-500 dark:ring-blue-400`;
                        }
                      }

                      return (
                        <button
                          key={optionWord.mandarin + optionIndex} // Unique key including index
                          onClick={() => handleOptionClick(q.id, optionWord)}
                          disabled={isDisabled}
                          className={`${buttonClasses} disabled:opacity-70 disabled:cursor-not-allowed`}
                          aria-pressed={isSelected}
                          aria-disabled={isDisabled}
                        >
                          <p className="text-lg font-mandarin font-bold" lang="zh-Hans">{optionWord.mandarin}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            {allQuestionsAnsweredCorrectly && (
              <button
                onClick={handleNextTurn}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300 shadow-md"
                aria-label="Bắt đầu lượt mới"
              >
                {poolOfAvailableWords.length > 0 ? "Lượt mới" : "Hoàn thành luyện tập"}
              </button>
            )}
          </>
        )
      }
    </div>
  );
};

export default FillInTheBlanksPractice;
