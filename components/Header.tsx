
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {/* Simple star logo for education theme */}
          <span className="text-2xl mr-2">🌟</span>
          <h1 className="text-2xl font-bold">Pavex HSK</h1>
        </div>
        <nav>
          {/* Navigation links will be in the main Navigation component */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
