import { HSKLevelData } from './types';
import { HSK1_VOCABULARY } from './hsk1-vocabulary';
import { HSK2_VOCABULARY } from './hsk2-vocabulary';
import { HSK3_VOCABULARY } from './hsk3-vocabulary'; // New import
import { HSK4_VOCABULARY } from './hsk4-vocabulary'; // New import

export const HSK_LEVELS: HSKLevelData[] = [
  { level: 'HSK 1', label: 'HSK 1', words: HSK1_VOCABULARY },
  { level: 'HSK 2', label: 'HSK 2', words: HSK2_VOCABULARY },
  { level: 'HSK 3', label: 'HSK 3', words: HSK3_VOCABULARY }, // Added HSK 3
  { level: 'HSK 4', label: 'HSK 4', words: HSK4_VOCABULARY }, // Added HSK 4
  { level: 'HSK 5', label: 'HSK 5', words: [] }, // Placeholder
  { level: 'HSK 6', label: 'HSK 6', words: [] }, // Placeholder
];