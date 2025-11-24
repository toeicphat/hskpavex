

import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Section } from './types';
import HandwritingPractice from './components/HandwritingPractice';
import VocabularyPractice from './components/VocabularyPractice';
import ReadingTranslationPractice from './components/ReadingTranslationPractice';
import HomePage from './components/HomePage';
import PracticeHistory from './components/PracticeHistory';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>(Section.HOME);
  const [selectedHSKLevel, setSelectedHSKLevel] = useState<string>('HSK 1');

  const handleSelectSection = (section: Section) => {
    setCurrentSection(section);
  };

  const handleSelectHSKLevel = (level: string) => {
    setSelectedHSKLevel(level);
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-50 dark:bg-slate-950 font-sans">
      <Header
        onSelectSection={handleSelectSection}
        currentSection={currentSection}
      />
      <main className="flex-grow p-4 md:p-8">
        {currentSection === Section.HOME && (
          <HomePage 
            onSelectSection={handleSelectSection}
            onSelectHSKLevel={handleSelectHSKLevel}
          />
        )}
        {currentSection === Section.HANDWRITING_PRACTICE && (
          <HandwritingPractice selectedHSKLevel={selectedHSKLevel} />
        )}
        {currentSection === Section.VOCABULARY_PRACTICE && (
          <VocabularyPractice selectedHSKLevel={selectedHSKLevel} />
        )}
        {currentSection === Section.READING_TRANSLATION_PRACTICE && (
          <ReadingTranslationPractice selectedHSKLevel={selectedHSKLevel} />
        )}
        {currentSection === Section.PRACTICE_HISTORY && (
          <PracticeHistory />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;