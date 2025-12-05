
import { WordRange, DifficultyLevel } from './types';

export const HSK_WORD_RANGES_PLACEHOLDER: WordRange[] = [
  { start: 1, end: 50, label: '1 - 50' },
  { start: 51, end: 100, label: '51 - 100' },
  { start: 101, end: 150, label: '101 - 150' },
  { start: 0, end: Infinity, label: 'Tất cả' },
];

export const MATCHING_GAME_WORD_COUNT = 10;
export const QUIZ_WORD_COUNT = 10; // Number of questions in a quiz
export const QUIZ_OPTION_COUNT = 4; // Number of options for each question

export const LISTEN_AND_SELECT_WORD_COUNT = 10; // Number of words to test in one session
export const LISTEN_AND_SELECT_OPTION_COUNT = 9; // Number of options to show per question (3x3 grid)

export const FILL_IN_THE_BLANKS_WORD_COUNT = 10; // Number of questions in a turn
export const FILL_IN_THE_BLANKS_OPTION_COUNT = 4; // Number of options for each question

export const HSK_DIFFICULTY_DISTRIBUTIONS: { [key: string]: { easy: number; medium: number; hard: number } } = {
  'HSK 1': { easy: 10, medium: 0, hard: 0 },
  'HSK 2': { easy: 8, medium: 2, hard: 0 },
  'HSK 3': { easy: 7, medium: 2, hard: 1 },
  'HSK 4': { easy: 5, medium: 3, hard: 2 },
  'HSK 5': { easy: 4, medium: 4, hard: 2 },
  'HSK 6': { easy: 3, medium: 4, hard: 3 },
  'TIENG TRUNG 3': { easy: 8, medium: 2, hard: 0 },
  'TIENG TRUNG 4': { easy: 7, medium: 3, hard: 0 }, // Adjusting for Tiếng Trung 4
};

export const DIFFICULTY_LEVEL_MAP: { [key in DifficultyLevel]: number } = {
  [DifficultyLevel.EASY]: 0,
  [DifficultyLevel.MEDIUM]: 1,
  [DifficultyLevel.HARD]: 2,
};

export const DIFFICULTY_INDEX_TO_LEVEL_MAP: DifficultyLevel[] = [
  DifficultyLevel.EASY,
  DifficultyLevel.MEDIUM,
  DifficultyLevel.HARD,
];
