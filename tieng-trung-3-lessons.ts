
import { WordRange } from './types';

interface LessonDefinition {
  label: string;
  startWordIndex: number; // 0-based inclusive
  endWordIndex: number;   // 0-based exclusive
}

const TIENG_TRUNG_3_LESSON_DEFINITIONS: LessonDefinition[] = [
  { label: 'Bài 1', startWordIndex: 0, endWordIndex: 17 },
  { label: 'Bài 2', startWordIndex: 17, endWordIndex: 35 },
  { label: 'Bài 3', startWordIndex: 35, endWordIndex: 52 },
  { label: 'Bài 4', startWordIndex: 52, endWordIndex: 68 },
  { label: 'Bài 5', startWordIndex: 68, endWordIndex: 83 },
  { label: 'Bài 6', startWordIndex: 83, endWordIndex: 99 },
  { label: 'Bài 7', startWordIndex: 99, endWordIndex: 111 },
  { label: 'Bài 8', startWordIndex: 111, endWordIndex: 128 },
  { label: 'Bài 9', startWordIndex: 128, endWordIndex: 143 },
  { label: 'Bài 10', startWordIndex: 143, endWordIndex: 158 },
  { label: 'Bài 11', startWordIndex: 158, endWordIndex: 176 },
  { label: 'Bài 12', startWordIndex: 176, endWordIndex: 190 },
  { label: 'Bài 13', startWordIndex: 190, endWordIndex: 205 },
  { label: 'Bài 14', startWordIndex: 205, endWordIndex: 222 },
  { label: 'Bài 15', startWordIndex: 222, endWordIndex: 239 },
  { label: 'Bài 16', startWordIndex: 239, endWordIndex: 254 },
  { label: 'Bài 17', startWordIndex: 254, endWordIndex: 268 },
  { label: 'Bài 18', startWordIndex: 268, endWordIndex: 285 },
  { label: 'Bài 19', startWordIndex: 285, endWordIndex: 300 },
  { label: 'Bài 20', startWordIndex: 300, endWordIndex: 314 },
];

export const generateTiengTrung3LessonRanges = (totalWords: number): WordRange[] => {
  const ranges: WordRange[] = TIENG_TRUNG_3_LESSON_DEFINITIONS.map(lesson => ({
    start: lesson.startWordIndex + 1, // Convert to 1-based index
    end: lesson.endWordIndex,
    label: lesson.label,
  }));

  // Add an "All" option
  if (totalWords > 0) {
    ranges.push({ start: 1, end: totalWords, label: 'Tất cả' });
  }

  return ranges;
};
