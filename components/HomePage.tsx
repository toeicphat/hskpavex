
import React from 'react';
import { BookOpenIcon, BrainIcon, UsersIcon, ClockIcon, TrophyIcon, SparklesIcon } from './icons'; 

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 bg-gradient-to-br from-blue-50 to-blue-200 dark:from-slate-800 dark:to-slate-900 rounded-lg shadow-2xl max-w-4xl mt-8 animate-fade-in">
      <h2 className="text-4xl font-extrabold text-center text-blue-800 dark:text-blue-200 mb-6 flex items-center justify-center gap-3">
        <SparklesIcon className="w-9 h-9 text-yellow-500" />
        Chào mừng đến với HSK Pavex!
      </h2>
      <p className="text-xl text-gray-700 dark:text-gray-300 text-center mb-8 leading-relaxed">
        Nền tảng luyện thi tiếng Trung HSK hiệu quả và toàn diện.
        Hãy cùng chúng tôi khám phá phiên bản HSK 3.0 mới nhất!
      </p>

      <div className="space-y-10">
        <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4 flex items-center gap-2">
            <BookOpenIcon className="w-7 h-7" /> Giới thiệu về HSK 3.0
          </h3>
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
            Kỳ thi Năng lực Hán ngữ (HSK) phiên bản 3.0, dự kiến ra mắt đầy đủ từ giữa đến cuối năm 2026,
            đánh dấu một bước tiến lớn trong việc đánh giá trình độ tiếng Trung của người học trên toàn thế giới.
            Phiên bản này được thiết kế để phản ánh chính xác hơn năng lực ngôn ngữ thực tế trong bối cảnh hiện đại.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4 flex items-center gap-2">
            <UsersIcon className="w-7 h-7" /> Cấu trúc mới: 9 cấp độ, 3 bậc
          </h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-200 space-y-2 leading-relaxed">
            <li>HSK 3.0 mở rộng từ 6 lên 9 cấp độ, được chia thành 3 bậc chính:</li>
            <ul className="list-disc list-inside ml-5 space-y-1">
                <li><span className="font-semibold text-blue-600 dark:text-blue-400">Sơ cấp (HSK 1-3):</span> Tập trung vào giao tiếp cơ bản hàng ngày.</li>
                <li><span className="font-semibold text-purple-600 dark:text-purple-400">Trung cấp (HSK 4-6):</span> Phát triển kỹ năng giao tiếp trong môi trường phức tạp hơn, học thuật và công việc.</li>
                <li><span className="font-semibold text-red-600 dark:text-red-400">Cao cấp (HSK 7-9):</span> Đòi hỏi khả năng sử dụng tiếng Trung chuyên sâu, phân tích và diễn đạt ý tưởng phức tạp.</li>
            </ul>
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-bold text-orange-700 dark:text-orange-300 mb-4 flex items-center gap-2">
            <BrainIcon className="w-7 h-7" /> Ba khía cạnh, Năm năng lực, Bốn kỹ năng
          </h3>
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
            HSK 3.0 đánh giá người học dựa trên "Ba khía cạnh" (Ngôn ngữ, Giao tiếp, Văn hóa),
            "Năm năng lực" (nghe, nói, đọc, viết, dịch - <span className="font-mandarin font-semibold text-lg">听、说、读、写、译</span>),
            và "Bốn kỹ năng" (nghe, nói, đọc, viết). Điều này đảm bảo một cái nhìn toàn diện về khả năng sử dụng tiếng Trung của thí sinh.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-bold text-teal-700 dark:text-teal-300 mb-4 flex items-center gap-2">
            <ClockIcon className="w-7 h-7" /> Danh sách từ vựng và ngữ pháp mới
          </h3>
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
            Phiên bản HSK 3.0 giới thiệu danh sách từ vựng (11.092 từ) và ngữ pháp được cập nhật,
            phản ánh ngôn ngữ hiện đại và đa dạng hơn. Điều này giúp người học tiếp cận tiếng Trung một cách chân thực và hiệu quả.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-4 flex items-center gap-2">
            <TrophyIcon className="w-7 h-7" /> Chuẩn bị cùng HSK Pavex!
          </h3>
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
            HSK Pavex cung cấp các bài luyện tập viết chữ Hán, luyện từ vựng đa dạng
            để giúp bạn vững vàng chinh phục các cấp độ HSK, đặc biệt là theo chuẩn HSK 3.0 mới.
            Hãy bắt đầu hành trình học tiếng Trung của bạn ngay hôm nay!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
