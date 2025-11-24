
import React from 'react';
import { PracticeSession, Section } from '../types';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from './icons';

interface SessionDetailViewProps {
  session: PracticeSession;
  onClose: () => void;
}

const getModeDisplayName = (session: PracticeSession): string => {
    // This can be expanded as more modes are added
    if (session.section === Section.HANDWRITING_PRACTICE) return 'Chép chính tả';
    return session.mode;
}

const SessionDetailView: React.FC<SessionDetailViewProps> = ({ session, onClose }) => {
  return (
    <div className="container mx-auto p-4 md:p-8 bg-blue-50 dark:bg-slate-900 rounded-lg shadow-xl max-w-4xl mt-8">
      <button onClick={onClose} className="mb-6 flex items-center text-blue-600 dark:text-blue-400 hover:underline">
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Quay lại lịch sử
      </button>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">
          Chi tiết Luyện tập
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-700 dark:text-gray-300">
          <div>
            <p className="text-sm text-gray-500">Hoạt động</p>
            <p className="font-semibold">{getModeDisplayName(session)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cấp độ</p>
            <p className="font-semibold">{session.hskLevel}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Thời gian</p>
            <p className="font-semibold">{new Date(session.timestamp).toLocaleString('vi-VN')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Kết quả</p>
            <p className="font-bold text-lg text-green-600 dark:text-green-400">{session.score} / {session.total}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {session.details.map((detail, index) => (
          <div key={index} className={`p-4 rounded-lg flex items-start space-x-4 ${detail.isCorrect ? 'bg-green-50 dark:bg-green-900/50 border-l-4 border-green-500' : 'bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500'}`}>
            <div className="flex-shrink-0">
              {detail.isCorrect ? (
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
              ) : (
                <XCircleIcon className="w-6 h-6 text-red-500" />
              )}
            </div>
            <div className="flex-grow">
              <p className="font-bold text-lg text-gray-800 dark:text-gray-200" lang="zh-Hans">
                {detail.word.mandarin}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {detail.word.pinyin} - {detail.word.vietnamese}
              </p>
              {!detail.isCorrect && detail.userAnswer && (
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  <strong>Câu trả lời của bạn:</strong> {detail.userAnswer}
                </p>
              )}
               {session.section === Section.HANDWRITING_PRACTICE && (
                 <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Đã hoàn thành viết.</p>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionDetailView;
