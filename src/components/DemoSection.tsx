import { useState } from 'react';
import { Play, RotateCcw, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface GradingResult {
  totalScore: number;
  grade: string;
  breakdown: {
    correctness: number;
    codeQuality: number;
    efficiency: number;
    documentation: number;
  };
  feedback: string;
  suggestions: string[];
  testResults: {
    passed: number;
    total: number;
    details: { id: number; passed: boolean; expected: string; actual: string }[];
  };
}

const sampleProblems = [
  {
    id: 'P001',
    title: 'Two Sum',
    description: 'Cho mảng số nguyên nums và số nguyên target. Trả về chỉ số của 2 số có tổng bằng target.',
  },
  {
    id: 'P002',
    title: 'FizzBuzz',
    description: 'In ra các số từ 1 đến n. Nếu chia hết cho 3 in "Fizz", chia hết cho 5 in "Buzz", chia hết cho cả 2 in "FizzBuzz".',
  },
  {
    id: 'P003',
    title: 'Palindrome Check',
    description: 'Kiểm tra xem một chuỗi có phải palindrome không (đọc xuôi và ngược đều giống nhau).',
  },
];

const sampleSubmissions: Record<string, { code: string; result: GradingResult }> = {
  'P001-good': {
    code: `def twoSum(nums, target):
    """
    Find two numbers that add up to target.
    Time: O(n), Space: O(n)
    """
    seen = {}  # Hash map for O(1) lookup
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test cases
print(twoSum([2, 7, 11, 15], 9))   # [0, 1]
print(twoSum([3, 2, 4], 6))         # [1, 2]
print(twoSum([3, 3], 6))            # [0, 1]`,
    result: {
      totalScore: 92,
      grade: 'A',
      breakdown: { correctness: 100, codeQuality: 90, efficiency: 95, documentation: 80 },
      feedback: 'Giải pháp xuất sắc! Sử dụng hash map để đạt O(n) time complexity. Code sạch, dễ đọc, có docstring rõ ràng. Variable naming tốt và logic chính xác.',
      suggestions: ['Có thể thêm type hints: def twoSum(nums: list[int], target: int) -> list[int]', 'Thêm edge case handling cho empty list'],
      testResults: { passed: 3, total: 3, details: [{ id: 1, passed: true, expected: '[0, 1]', actual: '[0, 1]' }, { id: 2, passed: true, expected: '[1, 2]', actual: '[1, 2]' }, { id: 3, passed: true, expected: '[0, 1]', actual: '[0, 1]' }] },
    },
  },
  'P001-bad': {
    code: `def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
print(twoSum([2,7,11,15], 9))`,
    result: {
      totalScore: 45,
      grade: 'F',
      breakdown: { correctness: 60, codeQuality: 30, efficiency: 20, documentation: 10 },
      feedback: 'Code có lỗi logic: vòng lặp j bắt đầu từ 0 thay vì i+1, dẫn đến trả về [0,0] khi nums[i]*2 = target. Thuật toán O(n²) không tối ưu. Thiếu comments và docstring.',
      suggestions: ['Sửa vòng lặp: for j in range(i+1, len(nums))', 'Sử dụng hash map để cải thiện efficiency', 'Thêm docstring giải thích function', 'Handle edge cases'],
      testResults: { passed: 2, total: 3, details: [{ id: 1, passed: true, expected: '[0, 1]', actual: '[0, 1]' }, { id: 2, passed: true, expected: '[1, 2]', actual: '[1, 2]' }, { id: 3, passed: false, expected: '[0, 1]', actual: '[0, 0]' }] },
    },
  },
  'P002-good': {
    code: `def fizzbuzz(n):
    """
    Classic FizzBuzz implementation.
    Time: O(n), Space: O(n) for result list
    """
    result = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Fizz")
        elif i % 5 == 0:
            result.append("Buzz")
        else:
            result.append(str(i))
    return result

# Test
for item in fizzbuzz(15):
    print(item)`,
    result: {
      totalScore: 85,
      grade: 'B',
      breakdown: { correctness: 100, codeQuality: 85, efficiency: 80, documentation: 75 },
      feedback: 'Code chạy đúng tất cả test cases. Logic rõ ràng, sử dụng i % 15 để check FizzBuzz trước. Có thể cải thiện bằng cách dùng string concatenation.',
      suggestions: ['Có thể dùng approach: result = "Fizz"*(i%3==0) + "Buzz"*(i%5==0) or str(i)', 'Thêm type hints'],
      testResults: { passed: 4, total: 4, details: [{ id: 1, passed: true, expected: '1', actual: '1' }, { id: 2, passed: true, expected: 'Fizz', actual: 'Fizz' }, { id: 3, passed: true, expected: 'Buzz', actual: 'Buzz' }, { id: 4, passed: true, expected: 'FizzBuzz', actual: 'FizzBuzz' }] },
    },
  },
  'P003-good': {
    code: `def is_palindrome(s: str) -> bool:
    """
    Check if string is palindrome.
    Handles case-insensitivity and ignores non-alphanumeric chars.
    Time: O(n), Space: O(1) with two pointers
    """
    # Clean the string
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    
    # Two pointer approach
    left, right = 0, len(cleaned) - 1
    while left < right:
        if cleaned[left] != cleaned[right]:
            return False
        left += 1
        right -= 1
    return True

# Tests
print(is_palindrome("A man, a plan, a canal: Panama"))  # True
print(is_palindrome("race a car"))  # False
print(is_palindrome(""))  # True`,
    result: {
      totalScore: 95,
      grade: 'A',
      breakdown: { correctness: 100, codeQuality: 95, efficiency: 95, documentation: 90 },
      feedback: 'Xuất sắc! Code rất clean, xử lý được cả case-insensitivity và non-alphanumeric characters. Two-pointer approach tối ưu O(n) time, O(1) space. Documentation đầy đủ.',
      suggestions: ['Có thể thêm thêm test cases với unicode characters', 'Consider adding generator expression for memory efficiency với string rất dài'],
      testResults: { passed: 3, total: 3, details: [{ id: 1, passed: true, expected: 'True', actual: 'True' }, { id: 2, passed: true, expected: 'False', actual: 'False' }, { id: 3, passed: true, expected: 'True', actual: 'True' }] },
    },
  },
};

export default function DemoSection() {
  const [selectedProblem, setSelectedProblem] = useState(sampleProblems[0].id);
  const [selectedSubmission, setSelectedSubmission] = useState<'good' | 'bad'>('good');
  const [isGrading, setIsGrading] = useState(false);
  const [result, setResult] = useState<GradingResult | null>(null);
  const [showCode, setShowCode] = useState(true);

  const handleGrade = () => {
    setIsGrading(true);
    setResult(null);

    // Simulate grading delay
    setTimeout(() => {
      const key = `${selectedProblem}-${selectedSubmission}`;
      const submission = sampleSubmissions[key] || sampleSubmissions['P001-good'];
      setResult(submission.result);
      setIsGrading(false);
    }, 2500);
  };

  const handleReset = () => {
    setResult(null);
    setIsGrading(false);
  };

  const currentKey = `${selectedProblem}-${selectedSubmission}`;
  const currentSubmission = sampleSubmissions[currentKey] || sampleSubmissions['P001-good'];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Demo Chấm Điểm
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Mô phỏng quá trình chấm điểm bài thi lập trình. Chọn bài toán, xem code mẫu,
            và nhấn "Chấm Điểm" để xem kết quả phân tích từ LLM.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel - Controls */}
          <div className="space-y-4">
            {/* Problem selection */}
            <div className="bg-gray-800/50 rounded-2xl border border-white/10 p-5">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">📋 Chọn Bài Toán</h3>
              <div className="space-y-2">
                {sampleProblems.map((problem) => (
                  <button
                    key={problem.id}
                    onClick={() => { setSelectedProblem(problem.id); handleReset(); }}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedProblem === problem.id
                        ? 'bg-violet-500/10 border-violet-500/30'
                        : 'bg-gray-800/30 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="font-medium text-sm text-white">{problem.title}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">{problem.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submission type */}
            <div className="bg-gray-800/50 rounded-2xl border border-white/10 p-5">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">📝 Chọn Bài Nộp</h3>
              <div className="space-y-2">
                <button
                  onClick={() => { setSelectedSubmission('good'); handleReset(); }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedSubmission === 'good'
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-gray-800/30 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="font-medium text-sm text-green-300">✅ Bài làm tốt</div>
                  <div className="text-xs text-gray-500 mt-1">Code sạch, tối ưu, đúng logic</div>
                </button>
                <button
                  onClick={() => { setSelectedSubmission('bad'); handleReset(); }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedSubmission === 'bad'
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-gray-800/30 border-white/5 hover:border-white/20'
                  }`}
                  disabled={selectedProblem !== 'P001'}
                >
                  <div className="font-medium text-sm text-red-300">❌ Bài làm chưa tốt</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {selectedProblem === 'P001' ? 'Bug logic, O(n²), thiếu docs' : 'Chỉ có bài mẫu tốt'}
                  </div>
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <button
                onClick={handleGrade}
                disabled={isGrading}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-medium hover:from-violet-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGrading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang chấm điểm...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Chấm Điểm (LLM)
                  </>
                )}
              </button>
              {result && (
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-700/50 border border-white/10 text-gray-300 hover:bg-gray-700 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Middle panel - Code */}
          <div className="bg-gray-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="text-sm text-gray-400 font-mono">submission.py</span>
              <button
                onClick={() => setShowCode(!showCode)}
                className="text-xs text-gray-400 hover:text-white"
              >
                {showCode ? 'Hide' : 'Show'}
              </button>
            </div>
            {showCode && (
              <div className="p-4 overflow-auto max-h-[500px]">
                <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                  {currentSubmission.code}
                </pre>
              </div>
            )}
          </div>

          {/* Right panel - Results */}
          <div className="space-y-4">
            {isGrading && (
              <div className="bg-gray-800/50 rounded-2xl border border-violet-500/20 p-6 text-center">
                <Loader2 className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Đang phân tích...</h3>
                <p className="text-sm text-gray-400">Qwen2.5-Coder-7B đang phân tích code</p>
                <div className="mt-4 space-y-2 text-xs text-gray-500">
                  <p className="animate-pulse">→ Syntax analysis...</p>
                  <p className="animate-pulse">→ Running test cases...</p>
                  <p className="animate-pulse">→ LLM code review...</p>
                  <p className="animate-pulse">→ Calculating scores...</p>
                </div>
              </div>
            )}

            {result && (
              <>
                {/* Score card */}
                <div className="bg-gray-800/50 rounded-2xl border border-white/10 p-5">
                  <div className="text-center mb-4">
                    <div className={`text-5xl font-bold ${
                      result.totalScore >= 80 ? 'text-green-400' :
                      result.totalScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {result.totalScore}
                    </div>
                    <div className={`text-2xl font-bold mt-1 ${
                      result.totalScore >= 80 ? 'text-green-400' :
                      result.totalScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      Grade: {result.grade}
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-3">
                    <ScoreBar label="Correctness" score={result.breakdown.correctness} color="green" />
                    <ScoreBar label="Code Quality" score={result.breakdown.codeQuality} color="blue" />
                    <ScoreBar label="Efficiency" score={result.breakdown.efficiency} color="purple" />
                    <ScoreBar label="Documentation" score={result.breakdown.documentation} color="orange" />
                  </div>
                </div>

                {/* Test results */}
                <div className="bg-gray-800/50 rounded-2xl border border-white/10 p-5">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">
                    Test Cases: {result.testResults.passed}/{result.testResults.total} passed
                  </h4>
                  <div className="space-y-2">
                    {result.testResults.details.map((tc) => (
                      <div key={tc.id} className="flex items-start gap-2 text-xs">
                        {tc.passed ? (
                          <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className={tc.passed ? 'text-green-300' : 'text-red-300'}>
                            Test #{tc.id}: {tc.passed ? 'PASS' : 'FAIL'}
                          </span>
                          {!tc.passed && (
                            <div className="text-gray-500 mt-0.5">
                              Expected: {tc.expected} | Got: {tc.actual}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feedback */}
                <div className="bg-gray-800/50 rounded-2xl border border-white/10 p-5">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-violet-400" />
                    LLM Feedback
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{result.feedback}</p>
                  
                  {result.suggestions.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-xs font-semibold text-gray-400 mb-2">💡 Gợi ý cải thiện:</h5>
                      <ul className="space-y-1">
                        {result.suggestions.map((s, i) => (
                          <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                            <span className="text-violet-400">•</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}

            {!result && !isGrading && (
              <div className="bg-gray-800/50 rounded-2xl border border-white/10 p-8 text-center">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-lg font-semibold text-white mb-2">Sẵn Sàng Chấm Điểm</h3>
                <p className="text-sm text-gray-400">
                  Chọn bài toán và bài nộp, sau đó nhấn "Chấm Điểm" để xem kết quả phân tích từ LLM.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  const colorClasses: Record<string, string> = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-300 font-medium">{score}/100</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colorClasses[color]} transition-all duration-1000`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
}
