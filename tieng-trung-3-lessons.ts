import { HSKWord, WordRange } from './types';
import { TIENG_TRUNG_3_VOCABULARY } from './tieng-trung-3-vocabulary';

// Define the start and end indices (0-based) for each lesson.
// These are then converted to 1-based start/end for the WordRange interface.
interface LessonDefinition {
  label: string;
  startWordIndex: number; // 0-based inclusive
  endWordIndex: number;   // 0-based exclusive
}

const TIENG_TRUNG_3_LESSON_DEFINITIONS: LessonDefinition[] = [
  { label: 'Bài 1', startWordIndex: 0, endWordIndex: 14 },
  { label: 'Bài 2', startWordIndex: 14, endWordIndex: 27 },
  { label: 'Bài 3', startWordIndex: 27, endWordIndex: 42 },
  { label: 'Bài 4', startWordIndex: 42, endWordIndex: 54 },
  { label: 'Bài 5', startWordIndex: 54, endWordIndex: 68 },
  { label: 'Bài 6', startWordIndex: 68, endWordIndex: 81 },
  { label: 'Bài 7', startWordIndex: 81, endWordIndex: 98 },
  { label: 'Bài 8', startWordIndex: 98, endWordIndex: 108 },
  { label: 'Bài 9', startWordIndex: 108, endWordIndex: 116 },
  { label: 'Bài 10', startWordIndex: 116, endWordIndex: 134 },
];

export const generateTiengTrung3LessonRanges = (totalWords: number): WordRange[] => {
  const ranges: WordRange[] = TIENG_TRUNG_3_LESSON_DEFINITIONS.map(lesson => ({
    start: lesson.startWordIndex + 1, // Convert to 1-based index
    end: lesson.endWordIndex,         // End index remains the same if used as exclusive bound, or convert for inclusive end
    label: lesson.label,
  }));

  // Add an "All" option
  if (totalWords > 0) {
    ranges.push({ start: 1, end: totalWords, label: 'Tất cả' });
  }

  return ranges;
};
