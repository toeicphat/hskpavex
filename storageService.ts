
import { HSKWord } from './types';

// SRS intervals in days. Index corresponds to srsLevel.
const SRS_INTERVALS_DAYS = [1, 2, 5, 10, 21, 45, 90, 180, 365];

export interface UserWordData {
  mandarin: string;
  srsLevel: number;
  nextReviewDate: string; // ISO String
  isHardWord: boolean;
  lastReviewedDate: string; // ISO String
}

export interface UserData {
  wordData: { [mandarinWord: string]: UserWordData };
}

const STORAGE_KEY = 'pavexHskUserData';

// --- Private Helper Functions ---

const loadUserData = (): UserData => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      // Basic validation
      if (parsedData && typeof parsedData.wordData === 'object') {
        return parsedData;
      }
    }
  } catch (error) {
    console.error("Failed to load user data from localStorage", error);
  }
  return { wordData: {} };
};

const saveUserData = (data: UserData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save user data to localStorage", error);
  }
};

const getNextReviewDate = (srsLevel: number): string => {
    const now = new Date();
    const daysToAdd = srsLevel >= 0 && srsLevel < SRS_INTERVALS_DAYS.length 
        ? SRS_INTERVALS_DAYS[srsLevel] 
        : SRS_INTERVALS_DAYS[SRS_INTERVALS_DAYS.length - 1];
    now.setDate(now.getDate() + daysToAdd);
    return now.toISOString();
};

const getInitialWordData = (word: HSKWord): UserWordData => ({
    mandarin: word.mandarin,
    srsLevel: 0,
    nextReviewDate: new Date().toISOString(),
    isHardWord: false,
    lastReviewedDate: new Date().toISOString(),
});


// --- Public API ---

export const updateWordOnResult = (word: HSKWord, isCorrect: boolean) => {
    const userData = loadUserData();
    const currentWordData = userData.wordData[word.mandarin] || getInitialWordData(word);
    
    let newSrsLevel = currentWordData.srsLevel;
    let newIsHardWord = currentWordData.isHardWord;

    if (isCorrect) {
        newSrsLevel = Math.min(currentWordData.srsLevel + 1, SRS_INTERVALS_DAYS.length - 1);
    } else {
        newSrsLevel = 0; // Reset SRS level on incorrect answer
        newIsHardWord = true; // Mark as a hard word automatically
    }
    
    const updatedWord: UserWordData = {
        ...currentWordData,
        srsLevel: newSrsLevel,
        nextReviewDate: getNextReviewDate(newSrsLevel),
        isHardWord: newIsHardWord,
        lastReviewedDate: new Date().toISOString(),
    };

    userData.wordData[word.mandarin] = updatedWord;
    saveUserData(userData);
};

export const markWordAsHard = (word: HSKWord, isHard: boolean) => {
    const userData = loadUserData();
    const currentWordData = userData.wordData[word.mandarin] || getInitialWordData(word);

    const updatedWord: UserWordData = {
        ...currentWordData,
        isHardWord: isHard,
    };
    
    // If marking as hard, also reset SRS progress
    if (isHard) {
        updatedWord.srsLevel = 0;
        updatedWord.nextReviewDate = getNextReviewDate(0);
    }
    
    userData.wordData[word.mandarin] = updatedWord;
    saveUserData(userData);
};

export const getWordUserData = (word: HSKWord): UserWordData | null => {
    if (!word) return null;
    const userData = loadUserData();
    return userData.wordData[word.mandarin] || null;
};

export const getHardWords = (allWords: HSKWord[]): HSKWord[] => {
    const userData = loadUserData();
    if (!userData.wordData || !allWords) return [];
    
    const hardWordMap = new Set<string>();
    for (const key in userData.wordData) {
        if (userData.wordData[key].isHardWord) {
            hardWordMap.add(key);
        }
    }
    return allWords.filter(word => hardWordMap.has(word.mandarin));
};

export const getReviewWords = (allWords: HSKWord[]): HSKWord[] => {
    const userData = loadUserData();
    if (!userData.wordData || !allWords) return [];
    const now = new Date().toISOString();
    
    const reviewWordMap = new Set<string>();
    for (const key in userData.wordData) {
        const wordData = userData.wordData[key];
        if (wordData.nextReviewDate <= now) {
            reviewWordMap.add(key);
        }
    }
    return allWords.filter(word => reviewWordMap.has(word.mandarin));
};
