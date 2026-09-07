import { Folder, FileCode, FileText, Database, Settings, TestTube } from 'lucide-react';

export default function ArchitectureSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Cấu Trúc Repository
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Repo được tổ chức theo kiến trúc modular, mỗi module đảm nhận một chức năng riêng biệt,
            dễ test và dễ mở rộng.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File tree */}
          <div className="bg-gray-800/50 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Folder className="w-5 h-5 text-yellow-400" />
              llm-code-grader/
            </h3>
            <div className="font-mono text-sm space-y-1">
              <TreeItem icon={<Folder className="w-4 h-4 text-yellow-400" />} name="config/" level={0} desc="Cấu hình models, rubrics" />
              <TreeItem icon={<FileText className="w-4 h-4 text-blue-400" />} name="config/model_config.yaml" level={1} desc="" />
              <TreeItem icon={<FileText className="w-4 h-4 text-blue-400" />} name="config/rubric.yaml" level={1} desc="" />
              <TreeItem icon={<Folder className="w-4 h-4 text-yellow-400" />} name="core/" level={0} desc="Core logic" />
              <TreeItem icon={<FileCode className="w-4 h-4 text-green-400" />} name="core/grader.py" level={1} desc="Main grading engine" />
              <TreeItem icon={<FileCode className="w-4 h-4 text-green-400" />} name="core/executor.py" level={1} desc="Code execution sandbox" />
              <TreeItem icon={<FileCode className="w-4 h-4 text-green-400" />} name="core/scorer.py" level={1} desc="Scoring logic" />
              <TreeItem icon={<Folder className="w-4 h-4 text-yellow-400" />} name="models/" level={0} desc="LLM integrations" />
              <TreeItem icon={<FileCode className="w-4 h-4 text-green-400" />} name="models/base.py" level={1} desc="Abstract base class" />
              <TreeItem icon={<FileCode className="w-4 h-4 text-green-400" />} name="models/qwen_coder.py" level={1} desc="Qwen2.5-Coder" />
              <TreeItem icon={<FileCode className="w-4 h-4 text-green-400" />} name="models/deepseek_coder.py" level={1} desc="DeepSeek-Coder" />
              <TreeItem icon={<Folder className="w-4 h-4 text-yellow-400" />} name="analyzers/" level={0} desc="Code analysis" />
              <TreeItem icon={<FileCode className="w-4 h-4 text-green-400" />} name="analyzers/syntax.py" level={1} desc="Syntax checking" />
              <TreeItem icon={<FileCode className="w-4 h-4 text-green-400" />} name="analyzers/style.py" level={1} desc="Style analysis" />
              <TreeItem icon={<FileCode className="w-4 h-4 text-green-400" />} name="analyzers/complexity.py" level={1} desc="Complexity metrics" />
              <TreeItem icon={<Folder className="w-4 h-4 text-yellow-400" />} name="test_runner/" level={0} desc="Test execution" />
              <TreeItem icon={<FileCode className="w-4 h-4 text-green-400" />} name="test_runner/runner.py" level={1} desc="Run test cases" />
              <TreeItem icon={<FileCode className="w-4 h-4 text-green-400" />} name="test_runner/comparator.py" level={1} desc="Compare outputs" />
              <TreeItem icon={<Folder className="w-4 h-4 text-yellow-400" />} name="prompts/" level={0} desc="LLM prompts" />
              <TreeItem icon={<FileText className="w-4 h-4 text-orange-400" />} name="prompts/grading_prompt.txt" level={1} desc="" />
              <TreeItem icon={<FileText className="w-4 h-4 text-orange-400" />} name="prompts/feedback_prompt.txt" level={1} desc="" />
              <TreeItem icon={<Folder className="w-4 h-4 text-yellow-400" />} name="tests/" level={0} desc="Unit tests" />
              <TreeItem icon={<FileCode className="w-4 h-4 text-pink-400" />} name="tests/test_grader.py" level={1} desc="" />
              <TreeItem icon={<FileCode className="w-4 h-4 text-pink-400" />} name="tests/test_executor.py" level={1} desc="" />
              <TreeItem icon={<FileCode className="w-4 h-4 text-cyan-400" />} name="kaggle_notebook.py" level={0} desc="Entry point for Kaggle" />
              <TreeItem icon={<FileText className="w-4 h-4 text-gray-400" />} name="requirements.txt" level={0} desc="" />
              <TreeItem icon={<FileText className="w-4 h-4 text-gray-400" />} name="README.md" level={0} desc="" />
            </div>
          </div>

          {/* Architecture diagram */}
          <div className="bg-gray-800/50 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-violet-400" />
              Luồng Xử Lý
            </h3>
            <div className="space-y-4">
              <FlowStep
                step={1}
                title="Input"
                description="Nhận bài thi (code) + đề bài + test cases"
                color="blue"
              />
              <FlowArrow />
              <FlowStep
                step={2}
                title="Pre-processing"
                description="Parse code, extract structure, kiểm tra syntax"
                color="indigo"
              />
              <FlowArrow />
              <FlowStep
                step={3}
                title="Code Execution"
                description="Chạy code trong sandbox, so sánh output với test cases"
                color="violet"
              />
              <FlowArrow />
              <FlowStep
                step={4}
                title="LLM Analysis"
                description="Gửi code + kết quả cho LLM phân tích quality, style, approach"
                color="purple"
              />
              <FlowArrow />
              <FlowStep
                step={5}
                title="Scoring"
                description="Tổng hợp điểm: correctness (40%), style (20%), efficiency (20%), documentation (20%)"
                color="pink"
              />
              <FlowArrow />
              <FlowStep
                step={6}
                title="Feedback"
                description="Tạo phản hồi chi tiết, gợi ý cải thiện"
                color="green"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TreeItem({ icon, name, level, desc }: { icon: React.ReactNode; name: string; level: number; desc: string }) {
  return (
    <div className="flex items-center gap-2 hover:bg-white/5 px-2 py-1 rounded transition-colors" style={{ paddingLeft: `${level * 20 + 8}px` }}>
      {icon}
      <span className="text-gray-300">{name}</span>
      {desc && <span className="text-gray-500 text-xs ml-2">— {desc}</span>}
    </div>
  );
}

function FlowStep({ step, title, description, color }: { step: number; title: string; description: string; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'border-blue-500/30 bg-blue-500/10',
    indigo: 'border-indigo-500/30 bg-indigo-500/10',
    violet: 'border-violet-500/30 bg-violet-500/10',
    purple: 'border-purple-500/30 bg-purple-500/10',
    pink: 'border-pink-500/30 bg-pink-500/10',
    green: 'border-green-500/30 bg-green-500/10',
  };

  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl border ${colorClasses[color]}`}>
      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white shrink-0">
        {step}
      </div>
      <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex justify-center">
      <div className="w-0.5 h-4 bg-gradient-to-b from-violet-500/50 to-transparent"></div>
    </div>
  );
}
