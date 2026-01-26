
export interface HSKWord {
  mandarin: string;
  pinyin: string;
  vietnamese: string;
}

export enum PracticeMode {
  PINYIN_VIETNAMESE = 'PINYIN_VIETNAMESE',
  VIETNAMESE_ONLY = 'VIETNAMESE_ONLY',
}

export enum VocabularyPracticeMode {
  FLASHCARD = 'FLASHCARD',
  MATCHING_WORDS = 'MATCHING_WORDS',
  QUIZ = 'QUIZ',
  LISTEN_AND_SELECT = 'LISTEN_AND_SELECT',
  FILL_IN_THE_BLANKS = 'FILL_IN_THE_BLANKS',
}

export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export interface WordRange {
  start: number;
  end: number;
  label: string;
}

export interface HSKLevelData {
  level: string;
  label: string;
  words: HSKWord[];
}

export enum Section {
  HOME = 'HOME',
  HANDWRITING_PRACTICE = 'HANDWRITING_PRACTICE',
  VOCABULARY_PRACTICE = 'VOCABULARY_PRACTICE',
  WRITING_PRACTICE = 'WRITING_PRACTICE',
  WRITING_TEST = 'WRITING_TEST',
  PRACTICE_HISTORY = 'PRACTICE_HISTORY',
}

export interface PracticeSessionDetail {
  word: HSKWord;
  isCorrect: boolean;
  userAnswer?: string; // e.g., for quiz, the selected Vietnamese meaning
}

export interface PracticeSession {
  id: string; // Unique ID, can be a timestamp string
  timestamp: string; // ISO string for sorting
  section: Section;
  mode: string; // VocabularyPracticeMode for vocab, or a descriptive string
  hskLevel: string;
  wordRangeLabel: string;
  score: number;
  total: number;
  details: PracticeSessionDetail[];
}

// FIX: Added ReadingArticle and ReadingMode types to resolve import errors.
export interface ReadingArticle {
  id: number;
  hskLevel: number;
  title: string;
  chineseTitle: string;
  content: string;
}

export enum ReadingMode {
  READING = 'READING',
  TRANSLATION = 'TRANSLATION',
}
