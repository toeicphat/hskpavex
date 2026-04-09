
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Section } from '../types';
import { HSK_LEVELS } from '../hsk-levels';
import { ChineseCharIcon, SparklesIcon, TypeIcon, TrophyIcon, PencilIcon } from './icons'; 

interface HomePageProps {
  onSelectSection: (section: Section) => void;
  onSelectHSKLevel: (level: string) => void;
}

const practiceModules = [
  {
    id: Section.HANDWRITING_PRACTICE,
    title: 'Ghi nhớ chép chính tả',
    description: 'Luyện viết chữ Hán để cải thiện trí nhớ và độ chính xác.',
    icon: <TypeIcon className="w-12 h-12 text-blue-500" />,
    color: 'blue',
  },
  {
    id: Section.VOCABULARY_PRACTICE,
    title: 'Luyện từ vựng',
    description: 'Củng cố vốn từ qua flashcards, quizzes, ghép từ và nhiều hơn nữa.',
    icon: <ChineseCharIcon className="w-12 h-12 text-green-500" />,
    color: 'green',
  },
  {
    id: Section.WRITING_TEST,
    title: 'Viết (Writing Test)',
    description: 'Luyện kỹ năng viết HSK (Sắp xếp câu, viết đoạn văn...).',
    icon: <PencilIcon className="w-12 h-12 text-purple-500" />,
    color: 'purple',
  },
];

interface Quote {
  mandarin: string;
  pinyin: string;
  vietnamese: string;
  author?: string;
}

const QUOTES: Quote[] = [
  {
    mandarin: '千里之行，始于足下',
    pinyin: 'Qiānlǐ zhī xíng, shǐ yú zú xià',
    vietnamese: 'Hành trình vạn dặm bắt đầu từ những bước chân đầu tiên.',
    author: 'Lão Tử (老子)',
  },
  {
    mandarin: '书山有路勤为径，学海无涯苦作舟。',
    pinyin: 'Shū shān yǒu lù qín wèi jìng, xué hǎi wú yá kǔ zuò zhōu.',
    vietnamese: 'Núi sách có đường, cần cù là lối; biển học vô biên, khổ luyện là thuyền.',
  },
  {
    mandarin: '活到老，学到老。',
    pinyin: 'Huó dào lǎo, xué dào lǎo.',
    vietnamese: 'Học, học nữa, học mãi (Sống đến già, học đến già).',
  },
  {
    mandarin: '学如逆水行舟，不进则退。',
    pinyin: 'Xué rú nì shuǐ xíng zhōu, bù jìn zé tuì.',
    vietnamese: 'Học như chèo thuyền ngược nước, không tiến ắt sẽ lùi.',
  },
  {
    mandarin: '绳锯木断，水滴石穿。',
    pinyin: 'Shéng jù mù duàn, shuǐ dī shí chuān.',
    vietnamese: 'Dây thừng cưa lâu gỗ cũng đứt, nước chảy đá mòn (Sự kiên trì trong học tập).',
  },
  {
    mandarin: '少壮不努力，老大徒伤悲。',
    pinyin: 'Shào zhuàng bù nǔ lì, lǎo dà tú shāng bēi.',
    vietnamese: 'Trẻ không nỗ lực, già chỉ biết bi thương.',
  },
  {
    mandarin: '温故而知新。',
    pinyin: 'Wēn gù ér zhī xīn.',
    vietnamese: 'Ôn lại cái cũ để hiểu thêm cái mới.',
  },
  {
    mandarin: '学而不思则罔，思而不学则殆。',
    pinyin: 'Xué ér bù sī zé wǎng, sī ér bù xué zé dài.',
    vietnamese: 'Học mà không suy nghĩ thì mờ mịt, nghĩ mà không học thì nguy hại.',
  },
  {
    mandarin: '读书百遍，其义自见。',
    pinyin: 'Dú shū bǎi biàn, qí yì zì xiàn.',
    vietnamese: 'Sách đọc trăm lần, ý nghĩa tự thấu hiểu.',
  },
  {
    mandarin: '纸上得来终觉浅，绝知此事要躬行。',
    pinyin: 'Zhǐ shàng dé lái zhōng jué qiǎn, jué zhī cǐ shì yào gōng xíng.',
    vietnamese: 'Kiến thức trên giấy vốn nông cạn, muốn hiểu sâu sắc phải thực hành.',
  },
  {
    mandarin: '好学近乎知。',
    pinyin: 'Hào xué jìn hū zhī.',
    vietnamese: 'Ham học hỏi là gần với trí tuệ rồi.',
  },
  {
    mandarin: '三人行，必有我师焉。',
    pinyin: 'Sān rén xíng, bì yǒu wǒ shī yān.',
    vietnamese: 'Trong ba người cùng đi, tất có người là thầy của ta.',
  },
  {
    mandarin: '敏而好学，不耻下问。',
    pinyin: 'Mǐn ér hào xué, bù chǐ xià wèn.',
    vietnamese: 'Thông minh ham học, không ngại hỏi kẻ dưới mình.',
  },
  {
    mandarin: '知之为知之，不知为不知，是知也。',
    pinyin: 'Zhī zhī wéi zhī zhī, bù zhī wéi bù zhī, shì zhī yě.',
    vietnamese: 'Biết thì nói là biết, không biết thì nói là không biết, đó mới là biết thực sự.',
  },
  {
    mandarin: '学无止境。',
    pinyin: 'Xué wú zhǐ jìng.',
    vietnamese: 'Sự học là không có điểm dừng.',
  },
  {
    mandarin: '欲穷千里目，更上一层楼。',
    pinyin: 'Yù qióng qiān lǐ mù, gèng shàng yī céng lóu.',
    vietnamese: 'Muốn nhìn xa nghìn dặm, hãy leo thêm một tầng lầu.',
  },
  {
    mandarin: '读书破万卷，下笔如有神。',
    pinyin: 'Dú shū pò wàn juàn, xià bǐ rú yǒu shén.',
    vietnamese: 'Đọc sách vạn cuốn, hạ bút như có thần.',
  },
  {
    mandarin: '知识就是力量。',
    pinyin: 'Zhī shi jiù shì lì liàng.',
    vietnamese: 'Tri thức chính là sức mạnh.',
  },
  {
    mandarin: '书到用时方恨少。',
    pinyin: 'Shū dào yòng shí fāng hèn shǎo.',
    vietnamese: 'Sách đến lúc dùng mới hận là đọc ít (Kiến thức đến khi cần mới thấy thiếu).',
  },
  {
    mandarin: '黑发不知勤学早，白首方悔读书迟。',
    pinyin: 'Hēi fà bù zhī qín xué zǎo, bái shǒu fāng huǐ dú shū chí.',
    vietnamese: 'Tóc đen không biết chăm học sớm, đầu bạc mới hối hận việc đọc sách đã muộn.',
  },
  {
    mandarin: '玉不琢，不成器；人不学，不知道。',
    pinyin: 'Yù bù zhuó, bù chéng qì; rén bù xué, bù zhī dào.',
    vietnamese: 'Ngọc không mài không thành đồ quý; người không học không hiểu đạo lý.',
  },
];

const HomePage: React.FC<HomePageProps> = ({ onSelectSection, onSelectHSKLevel }) => {
  const [selectedHSKLevel, setSelectedHSKLevel] = useState<string>('HSK 1');
  const [currentQuote, setCurrentQuote] = useState<Quote>(QUOTES[0]);

  useEffect(() => {
    // Randomly select a quote on mount
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setCurrentQuote(QUOTES[randomIndex]);
  }, []);

  // Handle local level change if we want to sync with parent
  const handleLevelChange = (level: string) => {
    setSelectedHSKLevel(level);
    onSelectHSKLevel(level);
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="text-center mb-8 animate-fade-in-up">
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 dark:text-blue-100 mb-4 tracking-tight">
          Chào mừng đến với <span className="text-blue-600 dark:text-blue-400">Pavex HSK</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Nền tảng luyện thi HSK toàn diện: Từ vựng, Ngữ pháp, và Kỹ năng viết.
        </p>

        {/* Motivational Quote Section */}
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <SparklesIcon className="w-24 h-24 text-blue-600" />
          </div>
          <p className="text-3xl md:text-4xl font-mandarin text-blue-800 dark:text-blue-300 mb-2 tracking-widest leading-relaxed" lang="zh-Hans">
            {currentQuote.mandarin}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium italic">
            {currentQuote.pinyin}
          </p>
          <div className="h-px w-16 bg-blue-300 dark:bg-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-700 dark:text-gray-200 font-semibold text-lg">
            "{currentQuote.vietnamese}"
          </p>
          {currentQuote.author && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">— {currentQuote.author}</p>
          )}
        </div>
      </div>

      <div className="mb-10 flex justify-center">
        <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-2 overflow-x-auto max-w-full">
          <span className="text-gray-500 dark:text-gray-400 font-medium px-2 whitespace-nowrap">Chọn cấp độ:</span>
          {HSK_LEVELS.filter(level => level.level !== 'TIENG TRUNG 3' && level.level !== 'TIENG TRUNG 4').map((levelData) => (
            <button
              key={levelData.level}
              onClick={() => handleLevelChange(levelData.level)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                selectedHSKLevel === levelData.level
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {levelData.label}
            </button>
          ))}
          <button
             onClick={() => handleLevelChange('CUSTOM')}
             className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                selectedHSKLevel === 'CUSTOM'
                  ? 'bg-purple-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
          >
            Tự chọn
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 px-4">
        {practiceModules.map((module) => (
          <div
            key={module.id}
            onClick={() => onSelectSection(module.id)}
            className={`group bg-${module.color}-100 dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-${module.color}-300 hover:border-${module.color}-600 dark:border-${module.color}-900 dark:hover:border-${module.color}-500 transform hover:-translate-y-1 relative overflow-hidden`}
          >
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300`}>
                {module.icon}
            </div>
            
            <div className="flex items-start space-x-6 relative z-10">
              <div className={`p-4 rounded-xl bg-white dark:bg-slate-700 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                {module.icon}
              </div>
              <div className="flex-1">
                <h3 className={`text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-${module.color}-600 dark:group-hover:text-${module.color}-400 transition-colors`}>
                  {module.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {module.description}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
                <span className={`text-sm font-medium text-${module.color}-600 dark:text-${module.color}-400 group-hover:translate-x-1 transition-transform duration-200 flex items-center`}>
                    Bắt đầu ngay &rarr;
                </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Hơn 5000+ từ vựng và bài tập đang chờ bạn khám phá.</p>
      </div>
    </div>
  );
};

export default HomePage;
