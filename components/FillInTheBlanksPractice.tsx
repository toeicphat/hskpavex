
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HSKWord, DifficultyLevel, PracticeSession, PracticeSessionDetail, Section, VocabularyPracticeMode } from '../types';
import {
  FILL_IN_THE_BLANKS_WORD_COUNT,
  FILL_IN_THE_BLANKS_OPTION_COUNT,
  HSK_DIFFICULTY_DISTRIBUTIONS,
  DIFFICULTY_LEVEL_MAP,
  DIFFICULTY_INDEX_TO_LEVEL_MAP,
} from '../global-constants';
import * as storageService from '../storageService';
import { GoogleGenAI, Type } from "@google/genai";
import { LoadingIcon } from './icons';

interface FillInTheBlanksPracticeProps {
  words: HSKWord[];
  fullVocabulary: HSKWord[]; // Full vocab for distractors
  selectedHSKLevel: string;
  selectedUserDifficulty: DifficultyLevel;
  autoAdvance: boolean;
  onPracticeEnd: (message: string, isFinal: boolean) => void;
  onGoBack: () => void;
  onWordResult: (word: HSKWord, isCorrect: boolean) => void;
  wordRangeLabel: string;
}

// Interface for individual question state within a turn
interface QuestionState {
  id: string;
  word: HSKWord;
  sentence: string | null;
  options: HSKWord[];
  selectedAnswerMandarin: string | null;
  feedback: 'correct' | 'incorrect' | null;
  isCorrectlyAnswered: boolean;
}

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

const FillInTheBlanksPractice: React.FC<FillInTheBlanksPracticeProps> = ({ words, fullVocabulary, selectedHSKLevel, selectedUserDifficulty, autoAdvance, onPracticeEnd, onGoBack, onWordResult, wordRangeLabel }) => {
  const [poolOfAvailableWords, setPoolOfAvailableWords] = useState<HSKWord[]>([]);
  const [currentTurnQuestionsData, setCurrentTurnQuestionsData] = useState<QuestionState[]>([]);
  const [currentTurnNumber, setCurrentTurnNumber] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [practiceCompleted, setPracticeCompleted] = useState<boolean>(false);
  const [isLoadingSentences, setIsLoadingSentences] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const sessionDetailsRef = useRef<PracticeSessionDetail[]>([]);

  const isInitialMount = useRef(true);

  const handleFinalPracticeEnd = useCallback(() => {
    const finalMessage = `Hoàn thành phần điền từ! Bạn đã đạt ${totalScore} / ${words.length} điểm.`;
    const session: PracticeSession = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        section: Section.VOCABULARY_PRACTICE,
        mode: VocabularyPracticeMode.FILL_IN_THE_BLANKS,
        hskLevel: selectedHSKLevel,
        wordRangeLabel: wordRangeLabel,
        score: totalScore,
        total: words.length,
        details: sessionDetailsRef.current,
    };
    storageService.addPracticeSession(session);
    setPracticeCompleted(true);
    onPracticeEnd(finalMessage, true);
  }, [totalScore, words.length, selectedHSKLevel, wordRangeLabel, onPracticeEnd]);


  const generateChineseSentence = useCallback(async (word: HSKWord, targetDifficulty: DifficultyLevel): Promise<string | null> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); 
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
            if (parsedResponse.sentence && parsedResponse.correct_word === word.mandarin) {
                const correctedSentence = parsedResponse.sentence.replace(/_+/g, '_____');
                generatedSentence = { sentence: correctedSentence, correct_word: word.mandarin };
            } else {
                if (parsedResponse.sentence && parsedResponse.sentence.includes('_')) {
                    const correctedSentence = parsedResponse.sentence.replace(/_+/g, '_____');
                    generatedSentence = { sentence: correctedSentence, correct_word: word.mandarin };
                } else {
                    return null;
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
    // Use fullVocabulary (allWords) to find distractors
    const incorrectOptionsPool = allWords.filter(w => w.mandarin !== correctWord.mandarin);
    const shuffledIncorrectOptions = shuffleArray(incorrectOptionsPool);
    const chosenIncorrectOptions = shuffledIncorrectOptions.slice(0, FILL_IN_THE_BLANKS_OPTION_COUNT - 1);
    return shuffleArray([correctWord, ...chosenIncorrectOptions]);
  }, []);

  const startNewTurn = useCallback(async (wordsForThisTurnPool: HSKWord[]) => {
    setMessage('');
    setIsLoadingSentences(true);
    setCurrentTurnQuestionsData([]);

    if (wordsForThisTurnPool.length === 0) {
        handleFinalPracticeEnd();
        setIsLoadingSentences(false);
        return;
    }

    let wordsForCurrentTurn: HSKWord[] = [];
    if (wordsForThisTurnPool.length < FILL_IN_THE_BLANKS_WORD_COUNT) {
      wordsForCurrentTurn = shuffleArray(wordsForThisTurnPool);
      setPoolOfAvailableWords([]);
      if (words.length > FILL_IN_THE_BLANKS_WORD_COUNT) {
          setMessage(`Lượt cuối cùng! Chỉ còn ${wordsForCurrentTurn.length} từ trong phạm vi này.`);
      }
    } else {
      const shuffledCurrentPool = shuffleArray(wordsForThisTurnPool);
      wordsForCurrentTurn = shuffledCurrentPool.slice(0, FILL_IN_THE_BLANKS_WORD_COUNT);
      setPoolOfAvailableWords(shuffledCurrentPool.slice(FILL_IN_THE_BLANKS_WORD_COUNT));
    }

    const hskDistribution = HSK_DIFFICULTY_DISTRIBUTIONS[selectedHSKLevel];
    if (!hskDistribution) {
        console.error(`No difficulty distribution found for HSK level: ${selectedHSKLevel}`);
        setMessage('Không thể xác định độ khó cho cấp độ HSK này.');
        setIsLoadingSentences(false);
        handleFinalPracticeEnd();
        return;
    }

    const baseDifficultiesForSlots: DifficultyLevel[] = [];
    for (let i = 0; i < hskDistribution.easy; i++) baseDifficultiesForSlots.push(DifficultyLevel.EASY);
    for (let i = 0; i < hskDistribution.medium; i++) baseDifficultiesForSlots.push(DifficultyLevel.MEDIUM);
    for (let i = 0; i < hskDistribution.hard; i++) baseDifficultiesForSlots.push(DifficultyLevel.HARD);
    shuffleArray(baseDifficultiesForSlots);

    const userBiasIndex = DIFFICULTY_LEVEL_MAP[selectedUserDifficulty] - DIFFICULTY_LEVEL_MAP[DifficultyLevel.MEDIUM];

    const newQuestions: QuestionState[] = await Promise.all(
      wordsForCurrentTurn.map(async (word, index) => {
        const baseDifficultyForSlot = baseDifficultiesForSlots[index] || DifficultyLevel.MEDIUM; // Fallback if array shorter
        let effectiveDifficultyIndex = DIFFICULTY_LEVEL_MAP[baseDifficultyForSlot] + userBiasIndex;
        effectiveDifficultyIndex = Math.max(0, Math.min(2, effectiveDifficultyIndex));
        const targetDifficultyLevel = DIFFICULTY_INDEX_TO_LEVEL_MAP[effectiveDifficultyIndex];

        const sentence = await generateChineseSentence(word, targetDifficultyLevel);
        const options = generateOptions(word, fullVocabulary); // Use full vocabulary for distractors
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

    const validQuestions = newQuestions.filter(q => q.sentence !== null && q.options.length > 0);

    if (validQuestions.length === 0) {
      setMessage('Không thể tạo đủ câu hỏi cho lượt này. Vui lòng thử lại hoặc chọn phạm vi từ khác.');
      setIsLoadingSentences(false);
      handleFinalPracticeEnd();
      return;
    }

    setCurrentTurnQuestionsData(validQuestions);
    setCurrentTurnNumber(prev => prev + 1);
    setIsLoadingSentences(false);
    
  }, [generateChineseSentence, generateOptions, words, currentTurnNumber, selectedHSKLevel, selectedUserDifficulty, handleFinalPracticeEnd, fullVocabulary]);


  useEffect(() => {
    if (words.length === 0) {
      onPracticeEnd('Không có từ vựng để luyện tập chế độ này. Vui lòng chọn phạm vi từ khác.', true);
      return;
    }
    
    sessionDetailsRef.current = [];
    setPoolOfAvailableWords(shuffleArray(words));
    setTotalScore(0);
    setPracticeCompleted(false);
    setMessage('');
    setCurrentTurnQuestionsData([]);
    setCurrentTurnNumber(0);
    isInitialMount.current = true;
  }, [words, onPracticeEnd, selectedHSKLevel]);

  useEffect(() => {
    if (!practiceCompleted && !isLoadingSentences && currentTurnQuestionsData.length === 0 && poolOfAvailableWords.length > 0) {
        startNewTurn(poolOfAvailableWords);
    } else if (!practiceCompleted && !isLoadingSentences && currentTurnQuestionsData.length === 0 && poolOfAvailableWords.length === 0 && !isInitialMount.current) {
        handleFinalPracticeEnd();
    }

    if (isInitialMount.current) {
        isInitialMount.current = false;
    }
  }, [poolOfAvailableWords, currentTurnQuestionsData.length, practiceCompleted, isLoadingSentences, startNewTurn, handleFinalPracticeEnd]);


  const handleOptionClick = useCallback((questionId: string, selectedWord: HSKWord) => {
    let wasAlreadyCorrect = false;
    
    const updatedData = currentTurnQuestionsData.map(q => {
        if (q.id === questionId && !q.isCorrectlyAnswered) {
            wasAlreadyCorrect = q.feedback === 'correct';
            const isCorrect = selectedWord.mandarin === q.word.mandarin;
            onWordResult(q.word, isCorrect);
            
            sessionDetailsRef.current.push({
              word: q.word,
              isCorrect,
              userAnswer: selectedWord.mandarin,
            });

            if (isCorrect) {
                if (!wasAlreadyCorrect) {
                    setTotalScore(prev => prev + 1);
                }
                return { ...q, selectedAnswerMandarin: selectedWord.mandarin, feedback: 'correct' as 'correct', isCorrectlyAnswered: true };
            } else {
                if (navigator.vibrate) navigator.vibrate(100);
                return { ...q, selectedAnswerMandarin: selectedWord.mandarin, feedback: 'incorrect' as 'incorrect' };
            }
        }
        return q;
    });

    setCurrentTurnQuestionsData(updatedData);

    const allCorrectNow = updatedData.every(q => q.isCorrectlyAnswered);
    if (autoAdvance && allCorrectNow) {
        setTimeout(() => {
            handleNextTurn();
        }, 1200);
    }
  }, [currentTurnQuestionsData, onWordResult, autoAdvance]);


  const allQuestionsAnsweredCorrectly = currentTurnQuestionsData.length > 0 && currentTurnQuestionsData.every(q => q.isCorrectlyAnswered);

  const handleNextTurn = useCallback(() => {
    setMessage('');
    if (poolOfAvailableWords.length > 0) {
        startNewTurn(poolOfAvailableWords);
    } else {
        handleFinalPracticeEnd();
    }
  }, [poolOfAvailableWords, startNewTurn, handleFinalPracticeEnd]);

  const handleRestartPractice = useCallback(() => {
    if (words.length === 0) {
        onPracticeEnd('Không có từ vựng để luyện tập chế độ này. Vui lòng chọn phạm vi từ khác.', true);
        return;
    }
    sessionDetailsRef.current = [];
    setPoolOfAvailableWords(shuffleArray(words));
    setTotalScore(0);
    setPracticeCompleted(false);
    setMessage('');
    setCurrentTurnQuestionsData([]);
    setCurrentTurnNumber(0);
  }, [words, onPracticeEnd]);


  if (words.length === 0) {
    return (
      <div className="text-center p-8 text-red-500">
        <p className="text-xl mb-4">{message || `Không có từ vựng để luyện tập chế độ "Điền Từ Thích Hợp" trong phạm vi này.`}</p>
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
      <h2 className="text-3xl font-extrabold text-center text-blue-800 dark:text-blue-300 mb-6">
        Điền Từ Thích Hợp: {selectedHSKLevel}
      </h2>
      {message && <p className="text-red-500 text-center mb-4">{message}</p>}

      {isLoadingSentences ? (
        <div className="text-center p-8 text-gray-700 dark:text-gray-300 mt-8">
          <LoadingIcon className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-xl">Đang tạo câu hỏi, vui lòng đợi...</p>
        </div>
      ) : practiceCompleted ? (
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
        <>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Lượt {currentTurnNumber} ({currentTurnQuestionsData.filter(q => q.isCorrectlyAnswered).length} / {currentTurnQuestionsData.length} đúng) (Tổng: {totalScore} / {words.length})
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl mb-8">
              {currentTurnQuestionsData.map((q, qIndex) => (
                <div key={q.id} className="bg-blue-200 dark:bg-slate-700 p-3 rounded-lg shadow-md flex flex-col">
                  <h4 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-2">Câu {qIndex + 1}:</h4>
                  
                  <p className="text-xl font-mandarin font-bold text-gray-800 dark:text-gray-200 mb-3 text-center" lang="zh-Hans">
                      {q.sentence || "Đang tải câu hỏi..."}
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-2">
                    {q.options.map((optionWord, optionIndex) => {
                      const isCorrectOption = q.word.mandarin === optionWord.mandarin;
                      const isSelected = q.selectedAnswerMandarin === optionWord.mandarin;
                      let buttonClasses = `flex-1 px-3 py-1.5 rounded-lg text-center transition-all duration-200 shadow-sm whitespace-nowrap min-w-[calc(25%-0.5rem)]`;
                      let isDisabled = q.isCorrectlyAnswered;

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
                          key={optionWord.mandarin + optionIndex}
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
            
            {allQuestionsAnsweredCorrectly && !autoAdvance && (
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
      )}
    </div>
  );
};

export default FillInTheBlanksPractice;
