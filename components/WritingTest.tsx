
import React, { useState, useMemo } from 'react';
import { PencilIcon, CheckCircleIcon, XCircleIcon, RefreshIcon, ArrowLeftIcon } from './icons';

const levels = [3, 4, 5, 6];

// --- Types & Data ---

interface QuestionPart1 {
  id: number;
  blocks: string[];
  correctAnswer: string; // Full sentence with punctuation
}

interface QuestionPart2 {
  id: number;
  prefix: string;
  pinyin: string;
  suffix: string;
  correctChar: string;
}

const HSK3_TEST_1_PART1: QuestionPart1[] = [
  {
    id: 71,
    blocks: ['被我', '吃了', '蛋糕'],
    correctAnswer: '蛋糕被我吃了。'
  },
  {
    id: 72,
    blocks: ['爱干净的', '猫是', '一种', '动物'],
    correctAnswer: '猫是一种爱干净的动物。'
  },
  {
    id: 73,
    blocks: ['那个', '两万人', '能坐', '体育馆'],
    correctAnswer: '那个体育馆能坐两万人。'
  },
  {
    id: 74,
    blocks: ['树', '街道两边的', '真高', '长得'],
    correctAnswer: '街道两边的树长得真高。'
  },
  {
    id: 75,
    blocks: ['词', '请用', '黑板上的', '一个句子', '写'],
    correctAnswer: '请用黑板上的词写一个句子。'
  }
];

const HSK3_TEST_1_PART2: QuestionPart2[] = [
  { id: 76, prefix: '你了解中国的茶', pinyin: 'wén', suffix: '化吗？', correctChar: '文' },
  { id: 77, prefix: '明天', pinyin: 'gōng', suffix: '司要举行一个重要的会议。', correctChar: '公' },
  { id: 78, prefix: '他先对大家的', pinyin: 'dào', suffix: '来表示欢迎。', correctChar: '到' },
  { id: 79, prefix: '', pinyin: 'Xué', suffix: '校旁边有条河，河里有很多鱼。', correctChar: '学' }, // Xué handled as 学
  { id: 80, prefix: '我打算去超市买点儿苹果', pinyin: 'hé', suffix: '西瓜，一起去吧？', correctChar: '和' },
];

// --- Grading Logic (Ported from Python Class specification) ---

interface ScoreResult {
  score: number;
  details: {
    questionId: number;
    userAnswer: string;
    correctAnswer: string;
    points: number;
    status: 'correct' | 'punctuation_error' | 'wrong';
  }[];
}

const HSK3WritingGrader = {
  // Part 1: Reordering (Max 12 pts)
  gradePart1: (userInput: string, correctAnswer: string): { points: number, status: 'correct' | 'punctuation_error' | 'wrong' } => {
    const cleanUser = userInput.trim();
    const cleanCorrect = correctAnswer.trim();

    // Rule 1: Exact match
    if (cleanUser === cleanCorrect) {
      return { points: 12, status: 'correct' };
    }

    // Rule 2: Punctuation error
    // Remove last character if it is punctuation
    const puncRegex = /[。？！.?!]$/;
    const userNoPunc = cleanUser.replace(puncRegex, '');
    const correctNoPunc = cleanCorrect.replace(puncRegex, '');

    // Normalize spaces for comparison just in case
    if (userNoPunc.replace(/\s/g, '') === correctNoPunc.replace(/\s/g, '')) {
      return { points: 10, status: 'punctuation_error' };
    }

    // Rule 3: Wrong
    return { points: 0, status: 'wrong' };
  },

  // Part 2: Fill in the blank (Max 8 pts)
  gradePart2: (userChar: string, correctChar: string): number => {
    return userChar.trim() === correctChar.trim() ? 8 : 0;
  }
};

// --- Components ---

const WritingTest: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState(3);
  const [activeTestId, setActiveTestId] = useState<number | null>(null);
  
  // State for Test Taking
  // Part 1 State: Array of currently arranged blocks per question
  const [part1Answers, setPart1Answers] = useState<{ [id: number]: string[] }>({});
  const [part1Punctuation, setPart1Punctuation] = useState<{ [id: number]: string }>({});
  
  // Part 2 State: User input string
  const [part2Answers, setPart2Answers] = useState<{ [id: number]: string }>({});

  const [testResult, setTestResult] = useState<ScoreResult | null>(null);

  const resetTest = () => {
    setPart1Answers({});
    setPart1Punctuation({});
    setPart2Answers({});
    setTestResult(null);
  };

  const handleStartTest = (id: number) => {
    resetTest();
    setActiveTestId(id);
  };

  const handleBlockClick = (qId: number, block: string, isSelected: boolean) => {
    setPart1Answers(prev => {
      const currentBlocks = prev[qId] || [];
      if (isSelected) {
        // Remove block (return to pool)
        return { ...prev, [qId]: currentBlocks.filter(b => b !== block) };
      } else {
        // Add block
        return { ...prev, [qId]: [...currentBlocks, block] };
      }
    });
  };

  const handleSubmit = () => {
    if (!activeTestId) return;

    let totalScore = 0;
    const details = [];

    // Grade Part 1
    HSK3_TEST_1_PART1.forEach(q => {
      const blocks = part1Answers[q.id] || [];
      const punc = part1Punctuation[q.id] || '';
      const userSentence = blocks.join('') + punc;
      
      const result = HSK3WritingGrader.gradePart1(userSentence, q.correctAnswer);
      totalScore += result.points;
      details.push({
        questionId: q.id,
        userAnswer: userSentence,
        correctAnswer: q.correctAnswer,
        points: result.points,
        status: result.status
      });
    });

    // Grade Part 2
    HSK3_TEST_1_PART2.forEach(q => {
      const userChar = part2Answers[q.id] || '';
      const points = HSK3WritingGrader.gradePart2(userChar, q.correctChar);
      totalScore += points;
      details.push({
        questionId: q.id,
        userAnswer: userChar,
        correctAnswer: q.correctChar,
        points: points,
        status: points === 8 ? 'correct' : 'wrong'
      });
    });

    setTestResult({ score: totalScore, details });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Render Views ---

  if (activeTestId) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <button 
          onClick={() => setActiveTestId(null)}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-1" /> Quay lại danh sách
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-10">
          <div className="flex justify-between items-center mb-8 border-b dark:border-gray-700 pb-4">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">HSK 3 - Test {activeTestId}</h2>
            {testResult && (
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Tổng điểm</p>
                <p className={`text-4xl font-extrabold ${testResult.score >= 60 ? 'text-green-600' : 'text-red-500'}`}>
                  {testResult.score}/100
                </p>
              </div>
            )}
          </div>

          {/* PART 1 */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4">
              Phần 1: Sắp xếp câu (60 điểm)
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 italic">
              Bấm vào các từ để sắp xếp. Đừng quên chọn dấu câu cuối cùng!
            </p>

            {HSK3_TEST_1_PART1.map((q, index) => {
              const selectedBlocks = part1Answers[q.id] || [];
              const availableBlocks = q.blocks.filter(b => !selectedBlocks.includes(b)); // Simple filtering for unique blocks
              // Ideally handle duplicate block text correctly if data had duplicates, but assuming unique for this test.
              
              const detail = testResult?.details.find(d => d.questionId === q.id);

              return (
                <div key={q.id} className="mb-8 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-gray-700 dark:text-gray-300 mr-2">{q.id}.</span>
                    {detail && (
                      <span className={`font-bold ${detail.points === 12 ? 'text-green-500' : detail.points === 10 ? 'text-yellow-500' : 'text-red-500'}`}>
                        +{detail.points} điểm
                      </span>
                    )}
                  </div>

                  {/* Answer Area */}
                  <div className="min-h-[60px] bg-white dark:bg-slate-800 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg p-3 flex flex-wrap items-center gap-2 mb-4">
                    {selectedBlocks.length === 0 && !part1Punctuation[q.id] && (
                      <span className="text-gray-400 text-sm">Bấm từ bên dưới để ghép câu...</span>
                    )}
                    {selectedBlocks.map((block, idx) => (
                      <button
                        key={`${block}-${idx}`}
                        onClick={() => !testResult && handleBlockClick(q.id, block, true)}
                        disabled={!!testResult}
                        className="bg-blue-100 dark:bg-slate-600 text-blue-800 dark:text-blue-200 px-3 py-1 rounded shadow-sm hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                      >
                        {block}
                      </button>
                    ))}
                    {part1Punctuation[q.id] && (
                       <span className="font-bold text-2xl text-gray-800 dark:text-gray-200 ml-1">{part1Punctuation[q.id]}</span>
                    )}
                  </div>

                  {/* Punctuation Selection */}
                  {!testResult && (
                    <div className="flex justify-end gap-2 mb-4">
                        {['。', '？', '！'].map(punc => (
                            <button
                                key={punc}
                                onClick={() => setPart1Punctuation(prev => ({...prev, [q.id]: punc}))}
                                className={`w-8 h-8 flex items-center justify-center rounded-full border ${part1Punctuation[q.id] === punc ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-300'}`}
                            >
                                {punc}
                            </button>
                        ))}
                    </div>
                  )}

                  {/* Source Blocks */}
                  {!testResult && (
                    <div className="flex flex-wrap gap-2">
                        {/* We iterate original blocks and check availability to keep order stable or just show available */}
                        {q.blocks.map((block, idx) => {
                            const isUsed = selectedBlocks.includes(block);
                            if (isUsed) return null;
                            return (
                                <button
                                    key={`${block}-src-${idx}`}
                                    onClick={() => handleBlockClick(q.id, block, false)}
                                    className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow-sm hover:bg-blue-50 dark:hover:bg-slate-600"
                                >
                                    {block}
                                </button>
                            );
                        })}
                    </div>
                  )}

                  {/* Feedback */}
                  {testResult && detail && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-slate-900 rounded border-l-4 border-blue-500">
                        {detail.status === 'punctuation_error' && (
                            <p className="text-yellow-600 text-sm mb-1">⚠️ Sai dấu câu (-2 điểm)</p>
                        )}
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                            <span className="font-semibold">Đáp án:</span> {q.correctAnswer}
                        </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* PART 2 */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4">
              Phần 2: Viết chữ Hán (40 điểm)
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 italic">
                Điền chữ Hán thích hợp vào chỗ trống dựa trên Pinyin.
            </p>

            {HSK3_TEST_1_PART2.map((q) => {
               const detail = testResult?.details.find(d => d.questionId === q.id);
               
               return (
                <div key={q.id} className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div className="flex items-center flex-wrap gap-2 text-lg text-gray-800 dark:text-gray-200">
                        <span className="font-bold mr-2 text-base">{q.id}.</span>
                        <span>{q.prefix}</span>
                        <div className="flex flex-col items-center mx-1">
                            <span className="text-sm text-gray-500 mb-1">{q.pinyin}</span>
                            <input 
                                type="text" 
                                value={part2Answers[q.id] || ''}
                                onChange={(e) => !testResult && setPart2Answers(prev => ({...prev, [q.id]: e.target.value}))}
                                disabled={!!testResult}
                                maxLength={1}
                                className={`w-12 h-10 border-b-2 text-center text-xl font-mandarin focus:outline-none focus:border-blue-500 bg-transparent
                                    ${testResult 
                                        ? (detail?.status === 'correct' ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600') 
                                        : 'border-gray-400'
                                    }
                                `}
                            />
                        </div>
                        <span>{q.suffix}</span>
                        
                        {detail && (
                            <span className={`ml-auto font-bold text-sm ${detail.points > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                +{detail.points}
                            </span>
                        )}
                    </div>
                    {testResult && detail && detail.status === 'wrong' && (
                        <div className="mt-2 ml-8 text-sm text-green-600">
                            Đáp án đúng: <span className="font-mandarin text-lg">{q.correctChar}</span>
                        </div>
                    )}
                </div>
               );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            {!testResult ? (
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-full shadow-lg transition-transform transform hover:scale-105"
                >
                    Nộp bài
                </button>
            ) : (
                <button
                    onClick={() => handleStartTest(activeTestId)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-full shadow-md flex items-center transition-colors"
                >
                    <RefreshIcon className="w-5 h-5 mr-2" /> Làm lại
                </button>
            )}
          </div>

        </div>
      </div>
    );
  }

  // --- Level & Test Selection View ---

  return (
    <div className="container mx-auto p-4 md:p-8 bg-blue-100 dark:bg-slate-800 rounded-lg shadow-xl max-w-6xl mt-8">
      <h2 className="text-3xl font-extrabold text-center text-blue-800 dark:text-blue-300 mb-8 flex items-center justify-center">
        <PencilIcon className="w-10 h-10 mr-3" />
        Luyện Viết (Writing)
      </h2>

      {/* Level Tabs */}
      <div className="flex justify-center space-x-4 mb-8 flex-wrap gap-y-2">
        {levels.map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`px-6 py-3 rounded-full text-lg font-bold transition-all duration-300 ${
              selectedLevel === lvl
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-600'
            }`}
          >
            HSK {lvl}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-700 rounded-xl p-6 min-h-[300px]">
        {selectedLevel === 3 ? (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center md:text-left">Danh sách bài test HSK 3</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => num === 1 ? handleStartTest(1) : null} // Only Test 1 is active for now
                  className={`p-6 rounded-xl border transition-all duration-200 group flex flex-col items-center justify-center shadow-sm 
                    ${num === 1 
                        ? 'bg-blue-50 dark:bg-slate-600 hover:bg-blue-100 dark:hover:bg-slate-500 border-blue-200 dark:border-slate-500 cursor-pointer' 
                        : 'bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-gray-600 opacity-60 cursor-not-allowed'
                    }`}
                >
                  <div className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-2">Test {num}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-200 text-center">
                    {num === 1 ? 'Bắt đầu' : 'Sắp ra mắt'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <span className="text-6xl mb-4 opacity-50">🚧</span>
            <p className="text-2xl font-medium">HSK {selectedLevel} - Sắp ra mắt</p>
            <p className="mt-2 text-lg">Tính năng đang được phát triển. Vui lòng quay lại sau!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WritingTest;
