import { Github, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gray-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">LLM Code Grader</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Hệ thống chấm điểm bài thi lập trình mã nguồn mở, sử dụng LLM dưới 10B parameters.
              Thiết kế modular, dễ triển khai trên Kaggle Notebook.
            </p>
          </div>

          {/* Supported Models */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Models Hỗ Trợ</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                Qwen2.5-Coder-7B-Instruct
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                DeepSeek-Coder-6.7B-Base
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                CodeLlama-7B-Instruct
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                Stable Code-3B (lightweight)
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Tài Nguyên</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct" target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-violet-400 flex items-center gap-2 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Qwen2.5-Coder on HuggingFace
                </a>
              </li>
              <li>
                <a href="https://huggingface.co/deepseek-ai/deepseek-coder-6.7b-base" target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-violet-400 flex items-center gap-2 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                  DeepSeek-Coder on HuggingFace
                </a>
              </li>
              <li>
                <a href="https://kaggle.com" target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-violet-400 flex items-center gap-2 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Kaggle Notebooks
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-violet-400 flex items-center gap-2 transition-colors">
                  <Github className="w-3.5 h-3.5" />
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © 2024 LLM Code Grader. Open source project for educational purposes.
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for developers
          </p>
        </div>

        {/* Tech stack */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {['Python', 'PyTorch', 'Transformers', 'Kaggle', 'Qwen2.5', 'Modular Design'].map((tech) => (
            <span key={tech} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
