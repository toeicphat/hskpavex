import React from 'react';

interface PinyinChar {
  char: string;
  pinyin: string;
}

interface PinyinTextRendererProps {
  pinyinData: PinyinChar[];
  showPinyin: boolean;
}

const PinyinTextRenderer: React.FC<PinyinTextRendererProps> = ({ pinyinData, showPinyin }) => {
  if (!pinyinData || pinyinData.length === 0) {
    return null;
  }

  return (
    <div className="leading-loose" style={{ lineHeight: showPinyin ? '3.5rem' : '2.5rem' }}>
      {pinyinData.map((item, index) => {
        // Handle newline characters
        if (item.char === '\n') {
          return <br key={`br-${index}`} />;
        }
        // Render characters and their pinyin
        return (
          <div key={`${item.char}-${index}`} className="inline-flex flex-col items-center justify-end mx-0.5 align-bottom">
            {showPinyin && (
              <span className="text-sm text-gray-500 dark:text-gray-400 select-none h-5">
                {item.pinyin || ''}
              </span>
            )}
            <span className="text-3xl font-mandarin text-gray-800 dark:text-gray-200" lang="zh-Hans">
              {item.char}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PinyinTextRenderer;
