import { Code2, Brain, BookOpen, Play, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Tổng Quan', icon: LayoutDashboard },
  { id: 'modules', label: 'Modules', icon: Code2 },
  { id: 'notebook', label: 'Kaggle Notebook', icon: BookOpen },
  { id: 'demo', label: 'Demo Chấm Điểm', icon: Play },
];

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                LLM Code Grader
              </h1>
              <p className="text-xs text-gray-400">Open Source &lt;10B</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        {/* Mobile nav */}
        <div className="md:hidden flex gap-1 pb-3 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
