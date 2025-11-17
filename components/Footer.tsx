
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-100 text-blue-800 dark:bg-slate-800 dark:text-gray-300 p-4 text-center mt-8 shadow-inner">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} Pavex HSK. All rights reserved.</p>
        <p className="text-sm mt-1">Practice Mandarin with Pavex HSK.</p>
      </div>
    </footer>
  );
};

export default Footer;