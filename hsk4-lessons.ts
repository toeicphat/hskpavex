
import { WordRange } from './types';

interface LessonDefinition {
  label: string;
  startWordIndex: number; // 0-based inclusive
  endWordIndex: number;   // 0-based exclusive
}

const HSK4_LESSON_DEFINITIONS: LessonDefinition[] = [
  { label: 'Bài 1', startWordIndex: 0, endWordIndex: 32 },
  { label: 'Bài 2', startWordIndex: 32, endWordIndex: 62 },
  { label: 'Bài 3', startWordIndex: 62, endWordIndex: 93 },
  { label: 'Bài 4', startWordIndex: 93, endWordIndex: 124 },
  { label: 'Bài 5', startWordIndex: 124, endWordIndex: 155 },
  { label: 'Bài 6', startWordIndex: 155, endWordIndex: 186 },
  { label: 'Bài 7', startWordIndex: 186, endWordIndex: 220 },
  { label: 'Bài 8', startWordIndex: 220, endWordIndex: 249 },
  { label: 'Bài 9', startWordIndex: 249, endWordIndex: 280 },
  { label: 'Bài 10', startWordIndex: 280, endWordIndex: 310 },
  { label: 'Bài 11', startWordIndex: 310, endWordIndex: 340 },
  { label: 'Bài 12', startWordIndex: 340, endWordIndex: 373 },
  { label: 'Bài 13', startWordIndex: 373, endWordIndex: 405 },
  { label: 'Bài 14', startWordIndex: 405, endWordIndex: 437 },
  { label: 'Bài 15', startWordIndex: 437, endWordIndex: 468 },
  { label: 'Bài 16', startWordIndex: 468, endWordIndex: 499 },
  { label: 'Bài 17', startWordIndex: 499, endWordIndex: 528 },
  { label: 'Bài 18', startWordIndex: 528, endWordIndex: 560 },
  { label: 'Bài 19', startWordIndex: 560, endWordIndex: 592 },
  { label: 'Bài 20', startWordIndex: 592, endWordIndex: 622 },
];

export const generateHSK4LessonRanges = (totalWords: number): WordRange[] => {
  const ranges: WordRange[] = HSK4_LESSON_DEFINITIONS.map(lesson => ({
    start: lesson.startWordIndex + 1, // Convert to 1-based index
    end: Math.min(lesson.endWordIndex, totalWords), // Ensure we don't exceed total
    label: lesson.label,
  }));

  // Add an "All" option if there are words
  if (totalWords > 0) {
    ranges.push({ start: 1, end: totalWords, label: 'Tất cả' });
  }

  return ranges;
};
