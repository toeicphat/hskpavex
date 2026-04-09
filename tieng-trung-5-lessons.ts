import { WordRange } from './types';

interface LessonDefinition {
  label: string;
  startWordIndex: number; // 0-based inclusive
  endWordIndex: number;   // 0-based exclusive
}

// Blank lesson definitions for Tiếng Trung 5
const TIENG_TRUNG_5_LESSON_DEFINITIONS: LessonDefinition[] = [
  { label: 'Bài 1', startWordIndex: 0, endWordIndex: 29 },
  { label: 'Bài 2', startWordIndex: 29, endWordIndex: 54 },
  { label: 'Bài 3', startWordIndex: 54, endWordIndex: 54 },
  { label: 'Bài 4', startWordIndex: 54, endWordIndex: 54 },
  { label: 'Bài 5', startWordIndex: 54, endWordIndex: 54 },
  { label: 'Bài 6', startWordIndex: 54, endWordIndex: 54 },
  { label: 'Bài 7', startWordIndex: 54, endWordIndex: 54 },
  { label: 'Bài 8', startWordIndex: 54, endWordIndex: 54 },
  { label: 'Bài 9', startWordIndex: 54, endWordIndex: 54 },
  { label: 'Bài 10', startWordIndex: 54, endWordIndex: 54 },
];

export const generateTiengTrung5LessonRanges = (totalWords: number): WordRange[] => {
  const ranges: WordRange[] = TIENG_TRUNG_5_LESSON_DEFINITIONS.map(lesson => ({
    start: totalWords === 0 ? 0 : lesson.startWordIndex + 1,
    end: Math.min(lesson.endWordIndex, totalWords),
    label: lesson.label,
  }));

  if (totalWords > 0) {
    ranges.push({ start: 1, end: totalWords, label: 'Tất cả' });
  }

  return ranges;
};
