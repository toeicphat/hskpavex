import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { ReadingArticle, ReadingMode } from '../types';
import { READING_ARTICLES } from '../reading-articles';
import PinyinTextRenderer from './PinyinTextRenderer';
import { LoadingIcon, MicrophoneIcon, StopIcon, ArrowLeftIcon } from './icons';

// Fix: Add type definitions for the Web Speech API to resolve TypeScript errors.
// These APIs are not standard in all browsers and may not be in default TS typings.
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

interface PinyinChar {
  char: string;
  pinyin: string;
}

const PracticeView: React.FC<{ article: ReadingArticle; mode: ReadingMode; onBack: () => void; }> = ({ article, mode, onBack }) => {
  const [showPinyin, setShowPinyin] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [pinyinData, setPinyinData] = useState<PinyinChar[]>([]);
  const [isLoadingPinyin, setIsLoadingPinyin] = useState(true);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef<string>('');

  const getPinyinForText = useCallback(async (text: string) => {
    setIsLoadingPinyin(true);
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY
});
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `For the following Chinese text, provide a JSON array where each item is an object with 'char' and 'pinyin' properties. For punctuation, spaces, or newline characters, the 'pinyin' property should be an empty string. Text: "${text}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                char: { type: Type.STRING },
                pinyin: { type: Type.STRING },
              },
              required: ['char', 'pinyin'],
            },
          },
        },
      });
      const responseText = response.text?.trim();
      if (responseText) {
        const parsedPinyinData = JSON.parse(responseText);
        setPinyinData(parsedPinyinData);
      }
    } catch (error) {
      console.error("Error fetching pinyin:", error);
      setMessage("Không thể tải pinyin cho văn bản.");
    } finally {
      setIsLoadingPinyin(false);
    }
  }, []);

  useEffect(() => {
    getPinyinForText(article.content);
  }, [article.content, getPinyinForText]);

  const handleEvaluation = async (transcript: string) => {
    if (!transcript) {
      setMessage("Không nhận được bản ghi âm. Vui lòng thử lại.");
      return;
    }
    setIsLoading(true);
    setEvaluation(null);
    setMessage('');
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY
});

    let prompt = '';
    if (mode === ReadingMode.READING) {
      prompt = `You are a Chinese pronunciation evaluator. The original text is: "${article.content}". The user's transcribed pronunciation is: "${transcript}". Please provide a brief evaluation in Vietnamese, focusing on major pronunciation and tone errors. Also provide a percentage estimate (e.g., "Độ chính xác: 95%"). Keep it concise.`;
    } else { // TRANSLATION
      prompt = `You are a Chinese-Vietnamese translation evaluator. The original Chinese text is: "${article.content}". The user's Vietnamese translation is: "${transcript}". Please evaluate the translation accuracy as a percentage (e.g., "Độ chính xác: 95%") and provide a brief comment in Vietnamese on any major errors. Keep it concise.`;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      setEvaluation(response.text || "Không có đánh giá.");
    } catch (error) {
      console.error("Error getting evaluation:", error);
      setMessage("Đã xảy ra lỗi khi đánh giá.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessage("Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    finalTranscriptRef.current = '';
    setEvaluation(null);
    setMessage('');

    const recognition = new SpeechRecognition();
    recognition.lang = mode === ReadingMode.READING ? 'zh-CN' : 'vi-VN';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      finalTranscriptRef.current += transcript;
    };

    recognition.onerror = (event) => {
      setMessage(`Lỗi ghi âm: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      handleEvaluation(finalTranscriptRef.current);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div className="bg-blue-100 dark:bg-slate-800 p-6 rounded-lg shadow-xl relative">
      <button onClick={onBack} className="absolute top-4 left-4 bg-gray-200 dark:bg-slate-600 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors">
        <ArrowLeftIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
      </button>
      <h3 className="text-2xl font-bold text-center text-blue-800 dark:text-blue-300 mb-2">{article.chineseTitle}</h3>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">{article.title}</p>

      <div className="text-center mb-6">
        <button onClick={() => setShowPinyin(p => !p)} className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors">
          {showPinyin ? 'Ẩn Pinyin' : 'Hiện Pinyin'}
        </button>
      </div>
      
      <div className="bg-white dark:bg-slate-700 p-4 rounded-md mb-6 max-h-[50vh] overflow-y-auto">
        {isLoadingPinyin ? (
          <div className="flex justify-center items-center h-40">
            <LoadingIcon className="w-8 h-8 animate-spin text-blue-500" />
            <p className="ml-2">Đang tải Pinyin...</p>
          </div>
        ) : (
          <PinyinTextRenderer pinyinData={pinyinData} showPinyin={showPinyin} />
        )}
      </div>

      <div className="text-center">
        <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {mode === ReadingMode.READING ? 'Luyện đọc' : 'Luyện dịch (sang tiếng Việt)'}
        </h4>
        {!isRecording ? (
          <button onClick={handleStartRecording} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center mx-auto">
            <MicrophoneIcon className="w-6 h-6 mr-2" />
            Bắt đầu ghi âm
          </button>
        ) : (
          <button onClick={handleStopRecording} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center mx-auto animate-pulse">
            <StopIcon className="w-6 h-6 mr-2" />
            Dừng ghi âm
          </button>
        )}
      </div>
      
      {message && <p className="text-red-500 text-center mt-4">{message}</p>}
      
      {(isLoading || evaluation) && (
        <div className="mt-8 p-6 bg-green-50 dark:bg-slate-700 rounded-lg shadow-lg">
          <h4 className="text-2xl font-bold text-green-700 dark:text-green-300 text-center mb-4">Đánh giá của AI</h4>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <LoadingIcon className="w-8 h-8 animate-spin text-green-500" />
              <p className="ml-2 text-lg">Đang phân tích...</p>
            </div>
          ) : (
            <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-center">{evaluation}</div>
          )}
        </div>
      )}
    </div>
  );
};

const ReadingTranslationPractice: React.FC<{ selectedHSKLevel: string }> = ({ selectedHSKLevel }) => {
  const [selectedArticle, setSelectedArticle] = useState<ReadingArticle | null>(null);
  const [selectedMode, setSelectedMode] = useState<ReadingMode | null>(null);

  const hskLevelNumber = parseInt(selectedHSKLevel.replace('HSK ', ''));
  const articlesForLevel = READING_ARTICLES.filter(a => a.hskLevel === hskLevelNumber);

  const handleSelectArticle = (article: ReadingArticle) => {
    setSelectedArticle(article);
  };

  const handleSelectMode = (mode: ReadingMode) => {
    setSelectedMode(mode);
  };

  const handleBackToArticleList = () => {
    setSelectedArticle(null);
    setSelectedMode(null);
  };

  const handleBackToModeSelection = () => {
    setSelectedMode(null);
  };

  if (selectedArticle && selectedMode) {
    return <PracticeView article={selectedArticle} mode={selectedMode} onBack={handleBackToModeSelection} />;
  }

  if (selectedArticle) {
    return (
      <div className="container mx-auto p-4 md:p-8 bg-blue-100 dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl mt-8">
        <button onClick={handleBackToArticleList} className="mb-6 flex items-center text-blue-600 dark:text-blue-400 hover:underline">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Quay lại danh sách bài
        </button>
        <h3 className="text-2xl font-bold text-center text-blue-800 dark:text-blue-300 mb-2">{selectedArticle.chineseTitle}</h3>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">{selectedArticle.title}</p>
        <h4 className="text-xl font-semibold text-center mb-4">Chọn chế độ luyện tập:</h4>
        <div className="flex justify-center gap-4">
          <button onClick={() => handleSelectMode(ReadingMode.READING)} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105">
            Tập đọc
          </button>
          <button onClick={() => handleSelectMode(ReadingMode.TRANSLATION)} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105">
            Luyện dịch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 bg-blue-100 dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl mt-8">
      <h2 className="text-3xl font-extrabold text-center text-blue-800 dark:text-blue-300 mb-6">
        Luyện Đọc - Dịch: {selectedHSKLevel}
      </h2>
      {articlesForLevel.length > 0 ? (
        <div className="space-y-4">
          {articlesForLevel.map(article => (
            <button
              key={article.id}
              onClick={() => handleSelectArticle(article)}
              className="w-full text-left p-4 bg-white dark:bg-slate-700 rounded-lg shadow hover:shadow-md hover:bg-blue-50 dark:hover:bg-slate-600 transition-all duration-200"
            >
              <h4 className="text-xl font-semibold text-blue-700 dark:text-blue-300">{article.chineseTitle}</h4>
              <p className="text-gray-600 dark:text-gray-400">{article.title}</p>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
          Chưa có bài đọc nào cho cấp độ {selectedHSKLevel}.
        </p>
      )}
    </div>
  );
};

export default ReadingTranslationPractice;
