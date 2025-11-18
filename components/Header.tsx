import React from 'react';
import { LogoIcon } from './icons'; // Updated import path

const Header: React.FC = () => {
  return (
    <header className="bg-blue-700 dark:bg-slate-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {/* Replaced graduation cap with LogoIcon */}
          <LogoIcon className="w-8 h-8 mr-2 text-white" aria-hidden="true" />
          <h1 className="text-2xl font-bold">HSK Pavex</h1>
        </div>
        <nav>
          {/* Navigation links will be in the main Navigation component */}
        </nav>
      </div>
    </header>
  );
};

export default Header;