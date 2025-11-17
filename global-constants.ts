

import { WordRange } from './types';

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
