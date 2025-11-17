
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import HandwritingPractice from './components/HandwritingPractice';
import VocabularyPractice from './components/VocabularyPractice';
import { Section } from './types';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>(Section.HANDWRITING_PRACTICE);
  const [selectedHSKLevel, setSelectedHSKLevel] = useState<string>('HSK 1'); // Default to HSK 1

  const handleSelectSection = (section: Section) => {
    setCurrentSection(section);
  };

  const handleSelectHSKLevel = (level: string) => {
    setSelectedHSKLevel(level);
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-50 dark:bg-slate-950 font-sans">
      <Header />
      <Navigation
        onSelectSection={handleSelectSection}
        onSelectHSKLevel={handleSelectHSKLevel}
        currentSection={currentSection}
        currentHSKLevel={selectedHSKLevel}
      />
      <main className="flex-grow p-4 md:p-8">
        {currentSection === Section.HANDWRITING_PRACTICE && (
          <HandwritingPractice selectedHSKLevel={selectedHSKLevel} />
        )}
        {currentSection === Section.VOCABULARY_PRACTICE && (
          <VocabularyPractice selectedHSKLevel={selectedHSKLevel} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;