import { WordRange } from './types';

interface LessonDefinition {
  label: string;
  startWordIndex: number; // 0-based inclusive
  endWordIndex: number;   // 0-based exclusive
}

// Lesson definitions based on vocabulary index
const TIENG_TRUNG_4_LESSON_DEFINITIONS: LessonDefinition[] = [
  { label: 'Bài 1', startWordIndex: 0, endWordIndex: 20 },
  { label: 'Bài 2', startWordIndex: 20, endWordIndex: 38 },
  { label: 'Bài 3', startWordIndex: 38, endWordIndex: 54 },
  { label: 'Bài 4', startWordIndex: 54, endWordIndex: 71 },
  { label: 'Bài 5', startWordIndex: 71, endWordIndex: 86 },
  { label: 'Bài 6', startWordIndex: 86, endWordIndex: 102 },
  { label: 'Bài 7', startWordIndex: 102, endWordIndex: 116 },
  { label: 'Bài 8', startWordIndex: 116, endWordIndex: 133 },
  { label: 'Bài 9', startWordIndex: 133, endWordIndex: 151 },
];

export const generateTiengTrung4LessonRanges = (totalWords: number): WordRange[] => {
  const ranges: WordRange[] = TIENG_TRUNG_4_LESSON_DEFINITIONS.map(lesson => ({
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