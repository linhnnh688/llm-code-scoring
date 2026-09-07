import { useState } from 'react';
import { Copy, Check, Download, BookOpen } from 'lucide-react';

const notebookCells = [
  {
    id: 1,
    type: 'markdown',
    content: `# 🤖 LLM Code Grader - Kaggle Notebook
## Hệ thống chấm điểm bài thi lập trình sử dụng Open Source LLM

**Models hỗ trợ:** Qwen2.5-Coder-7B, DeepSeek-Coder-6.7B, CodeLlama-7B  
**GPU yêu cầu:** T4 (16GB) hoặc P100 (16GB)  
**Thời gian chạy:** ~5-10 phút cho 50 bài thi`
  },
  {
    id: 2,
    type: 'code',
    content: `# ============================================
# Cell 1: Clone Repository & Install Dependencies
# ============================================
import subprocess
import sys
import os

# Clone the grading repository
REPO_URL = "https://github.com/your-org/llm-code-grader.git"
REPO_DIR = "llm-code-grader"

if not os.path.exists(REPO_DIR):
    !git clone $REPO_URL
    print("✅ Repository cloned successfully")
else:
    !cd $REPO_DIR && git pull
    print("✅ Repository updated")

# Install dependencies
!pip install -q transformers accelerate torch
!pip install -q pyyaml datasets
!pip install -q bitsandbytes  # For quantized models

# Add repo to path
sys.path.insert(0, REPO_DIR)
print("✅ Dependencies installed")`
  },
  {
    id: 3,
    type: 'code',
    content: `# ============================================
# Cell 2: Import Modules from Repo
# ============================================
from core.grader import CodeGrader
from core.executor import CodeExecutor
from core.scorer import Scorer
from models.qwen_coder import QwenCoderModel
from test_runner.runner import TestRunner

import json
import yaml
import pandas as pd
from datetime import datetime

print("✅ All modules imported successfully")
print(f"   - CodeGrader: {CodeGrader}")
print(f"   - QwenCoderModel: {QwenCoderModel}")
print(f"   - TestRunner: {TestRunner}")`
  },
  {
    id: 4,
    type: 'code',
    content: `# ============================================
# Cell 3: Load Model (Qwen2.5-Coder-7B)
# ============================================
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

MODEL_NAME = "Qwen/Qwen2.5-Coder-7B-Instruct"

print(f"🔄 Loading model: {MODEL_NAME}")
print(f"   GPU: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU'}")
print(f"   Memory: {torch.cuda.get_device_properties(0).total_mem / 1e9:.1f} GB" if torch.cuda.is_available() else "")

# Load with optimizations for Kaggle
tokenizer = AutoTokenizer.from_pretrained(
    MODEL_NAME,
    trust_remote_code=True
)

model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float16,
    device_map="auto",
    trust_remote_code=True,
    low_cpu_mem_usage=True,
)

model.eval()
print("✅ Model loaded successfully!")
print(f"   Parameters: ~7B")
print(f"   Context length: 32K tokens")`
  },
  {
    id: 5,
    type: 'code',
    content: `# ============================================
# Cell 4: Define Test Problems & Submissions
# ============================================

# Example: Define problems and student submissions
problems = [
    {
        "id": "P001",
        "title": "Two Sum",
        "description": """Given an array of integers nums and an integer target, 
return indices of the two numbers such that they add up to target.""",
        "test_cases": [
            {"input": "nums=[2,7,11,15], target=9", "expected_output": "[0, 1]"},
            {"input": "nums=[3,2,4], target=6", "expected_output": "[1, 2]"},
            {"input": "nums=[3,3], target=6", "expected_output": "[0, 1]"},
        ]
    },
    {
        "id": "P002", 
        "title": "Reverse String",
        "description": "Write a function that reverses a string.",
        "test_cases": [
            {"input": "hello", "expected_output": "olleh"},
            {"input": "world", "expected_output": "dlrow"},
        ]
    }
]

# Student submissions (in practice, load from CSV/JSON)
submissions = [
    {
        "student_id": "STU001",
        "problem_id": "P001",
        "code": """
def twoSum(nums, target):
    # Using hash map - O(n) time complexity
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test
print(twoSum([2,7,11,15], 9))
print(twoSum([3,2,4], 6))
print(twoSum([3,3], 6))
""",
        "language": "python"
    },
    {
        "student_id": "STU002",
        "problem_id": "P001",
        "code": """
def twoSum(nums, target):
    # Brute force - O(n^2) time complexity
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]

# Test
print(twoSum([2,7,11,15], 9))
print(twoSum([3,2,4], 6))
print(twoSum([3,3], 6))
""",
        "language": "python"
    }
]

print(f"✅ Loaded {len(problems)} problems")
print(f"✅ Loaded {len(submissions)} submissions")`
  },
  {
    id: 6,
    type: 'code',
    content: `# ============================================
# Cell 5: Initialize Grader & Run Grading
# ============================================

# Initialize the grader with our model
grader = CodeGrader.__new__(CodeGrader)
grader.config = {
    "model": {"name": "qwen2.5-coder", "path": MODEL_NAME},
    "timeout": 10,
    "rubric": {
        "correctness": {"weight": 0.40},
        "code_quality": {"weight": 0.20},
        "efficiency": {"weight": 0.20},
        "documentation": {"weight": 0.20},
    }
}
grader.executor = CodeExecutor(timeout=10)
grader.test_runner = TestRunner()
grader.scorer = Scorer(grader.config["rubric"])

# Use our loaded model directly
from models.qwen_coder import QwenCoderModel
grader.model = QwenCoderModel.__new__(QwenCoderModel)
grader.model.model = model
grader.model.tokenizer = tokenizer
grader.model.device = "cuda"

print("🔄 Starting grading process...")
print("=" * 50)

# Grade all submissions
results = []
for i, submission in enumerate(submissions):
    print(f"\\n📝 Grading submission {i+1}/{len(submissions)}: {submission['student_id']}")
    
    # Find matching problem
    problem = next(p for p in problems if p["id"] == submission["problem_id"])
    
    # Prepare full submission
    full_submission = {
        **submission,
        "problem": problem["description"],
        "test_cases": problem["test_cases"]
    }
    
    # Run grading
    result = grader.grade(full_submission)
    results.append(result)
    
    print(f"   Score: {result['total_score']:.1f}/100 ({result.get('grade', 'N/A')})")
    print(f"   Feedback: {result['feedback'][:100]}...")

print("\\n" + "=" * 50)
print(f"✅ Grading complete! {len(results)} submissions graded.")`
  },
  {
    id: 7,
    type: 'code',
    content: `# ============================================
# Cell 6: Display Results
# ============================================

# Create results DataFrame
df_results = pd.DataFrame([
    {
        "Student ID": r["student_id"],
        "Total Score": r["total_score"],
        "Grade": r.get("grade", "N/A"),
        "Correctness": r["breakdown"].get("correctness", {}).get("score", 0),
        "Code Quality": r["breakdown"].get("code_quality", {}).get("score", 0),
        "Efficiency": r["breakdown"].get("efficiency", {}).get("score", 0),
        "Documentation": r["breakdown"].get("documentation", {}).get("score", 0),
        "Passed": "✅" if r.get("passed", False) else "❌",
    }
    for r in results
])

print("\\n📊 GRADING RESULTS")
print("=" * 80)
print(df_results.to_string(index=False))

# Statistics
print("\\n\\n📈 STATISTICS")
print(f"   Average Score: {df_results['Total Score'].mean():.1f}")
print(f"   Highest Score: {df_results['Total Score'].max():.1f}")
print(f"   Lowest Score: {df_results['Total Score'].min():.1f}")
print(f"   Pass Rate: {(df_results['Passed'] == '✅').sum()}/{len(df_results)}")`
  },
  {
    id: 8,
    type: 'code',
    content: `# ============================================
# Cell 7: Export Results
# ============================================

# Save detailed results to JSON
output_data = {
    "timestamp": datetime.now().isoformat(),
    "model": MODEL_NAME,
    "total_submissions": len(results),
    "results": results
}

with open("grading_results.json", "w") as f:
    json.dump(output_data, f, indent=2, ensure_ascii=False)

# Save CSV summary
df_results.to_csv("grading_summary.csv", index=False)

print("✅ Results exported:")
print("   📄 grading_results.json - Detailed results")
print("   📄 grading_summary.csv - Summary table")

# Download files (Kaggle specific)
from kaggle_web_client import KaggleWebClient
web_client = KaggleWebClient()
web_client.write_file_to_downloadable("grading_results.json")
web_client.write_file_to_downloadable("grading_summary.csv")

print("\\n🎉 Done! Files are ready for download.")`
  },
];

export default function NotebookSection() {
  const [copiedCell, setCopiedCell] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyCell = (cellId: number, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedCell(cellId);
    setTimeout(() => setCopiedCell(null), 2000);
  };

  const handleCopyAll = () => {
    const allCode = notebookCells
      .filter((c) => c.type === 'code')
      .map((c) => c.content)
      .join('\n\n# ' + '='.repeat(60) + '\n\n');
    navigator.clipboard.writeText(allCode);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownload = () => {
    const content = notebookCells.map((cell) => {
      if (cell.type === 'markdown') {
        return `# ${cell.content}`;
      }
      return cell.content;
    }).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kaggle_notebook.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Kaggle Notebook
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Notebook hoàn chỉnh để chạy trên Kaggle. Clone repo, load model Qwen2.5-Coder-7B,
            và chấm điểm bài thi tự động.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 hover:bg-violet-500/30 transition-all text-sm"
            >
              {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedAll ? 'Copied All!' : 'Copy All Code'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30 transition-all text-sm"
            >
              <Download className="w-4 h-4" />
              Download .py
            </button>
          </div>
        </div>

        {/* Notebook cells */}
        <div className="space-y-4">
          {notebookCells.map((cell) => (
            <div
              key={cell.id}
              className={`rounded-xl border overflow-hidden ${
                cell.type === 'markdown'
                  ? 'border-blue-500/20 bg-blue-500/5'
                  : 'border-white/10 bg-gray-800/50'
              }`}
            >
              {/* Cell header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-gray-800/30">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    cell.type === 'markdown'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-green-500/20 text-green-300'
                  }`}>
                    {cell.type === 'markdown' ? 'Markdown' : 'Code'}
                  </span>
                  <span className="text-xs text-gray-500">Cell {cell.id}</span>
                </div>
                {cell.type === 'code' && (
                  <button
                    onClick={() => handleCopyCell(cell.id, cell.content)}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    {copiedCell === cell.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    {copiedCell === cell.id ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
              {/* Cell content */}
              <div className="p-4 overflow-x-auto">
                <pre className={`text-sm font-mono whitespace-pre-wrap ${
                  cell.type === 'markdown' ? 'text-blue-200' : 'text-gray-300'
                }`}>
                  {cell.content}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-2xl border border-violet-500/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-violet-400" />
            Hướng Dẫn Sử Dụng trên Kaggle
          </h3>
          <ol className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0">1</span>
              <span>Mở <a href="https://kaggle.com" className="text-violet-400 underline" target="_blank" rel="noopener">Kaggle</a> → Tạo Notebook mới</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0">2</span>
              <span>Settings → Accelerator → chọn <strong>GPU T4 x2</strong> hoặc <strong>P100</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0">3</span>
              <span>Settings → Internet → <strong>Turn on</strong> (để clone repo & download model)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0">4</span>
              <span>Copy từng cell vào notebook hoặc download file .py rồi paste</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0">5</span>
              <span>Run All → Đợi ~5 phút → Xem kết quả và download files</span>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
