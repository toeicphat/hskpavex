
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
