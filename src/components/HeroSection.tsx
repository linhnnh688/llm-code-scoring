import { Cpu, GitBranch, Zap, Shield } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 px-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-8">
          <Zap className="w-4 h-4" />
          <span>Open Source LLM &lt; 10B Parameters</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-white via-violet-200 to-indigo-200 bg-clip-text text-transparent">
            Chấm Điểm Bài Thi
          </span>
          <br />
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Lập Trình Bằng AI
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12">
          Hệ thống chấm điểm tự động sử dụng mô hình ngôn ngữ lớn mã nguồn mở,
          được thiết kế modular để dễ dàng triển khai trên Kaggle Notebook.
          Hỗ trợ Python, C++, Java và nhiều ngôn ngữ lập trình khác.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <FeatureCard
            icon={<Cpu className="w-6 h-6" />}
            title="LLM < 10B"
            description="Sử dụng Qwen2.5-Coder, DeepSeek-Coder, CodeLlama - chạy được trên GPU miễn phí Kaggle"
            color="violet"
          />
          <FeatureCard
            icon={<GitBranch className="w-6 h-6" />}
            title="Modular Repo"
            description="Cấu trúc module rõ ràng, dễ maintain, test riêng biệt từng thành phần"
            color="indigo"
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Kaggle Ready"
            description="Notebook tự động clone repo, cài dependencies và chạy chấm điểm"
            color="purple"
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Công Bằng"
            description="Rubric rõ ràng, chấm điểm khách quan, có giải thích chi tiết"
            color="blue"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    violet: 'from-violet-500/20 to-violet-600/5 border-violet-500/20',
    indigo: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/20',
    purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/20',
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20',
  };

  const iconColors: Record<string, string> = {
    violet: 'text-violet-400',
    indigo: 'text-indigo-400',
    purple: 'text-purple-400',
    blue: 'text-blue-400',
  };

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm`}>
      <div className={`${iconColors[color]} mb-4`}>{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
