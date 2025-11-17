
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
  LISTEN_AND_SELECT = 'LISTEN_AND_SELECT', // New mode
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
  HANDWRITING_PRACTICE = 'HANDWRITING_PRACTICE',
  VOCABULARY_PRACTICE = 'VOCABULARY_PRACTICE',
}
