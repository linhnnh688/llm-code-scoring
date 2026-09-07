import { useState } from 'react';
import { Code2, ChevronRight, Copy, Check } from 'lucide-react';

const modules = [
  {
    id: 'core',
    name: 'core/grader.py',
    description: 'Module chính điều phối quá trình chấm điểm',
    color: 'violet',
    code: `"""
Core Grading Engine
Điều phối toàn bộ quá trình chấm điểm bài thi
"""
import yaml
from typing import Dict, List, Optional
from models.base import BaseLLMModel
from models.qwen_coder import QwenCoderModel
from analyzers.syntax import SyntaxAnalyzer
from analyzers.style import StyleAnalyzer
from test_runner.runner import TestRunner
from core.executor import CodeExecutor
from core.scorer import Scorer


class CodeGrader:
    """Main grading engine - orchestrates the entire grading process"""
    
    def __init__(self, config_path: str = "config/model_config.yaml"):
        self.config = self._load_config(config_path)
        self.model = self._init_model()
        self.executor = CodeExecutor(timeout=self.config.get("timeout", 10))
        self.test_runner = TestRunner()
        self.scorer = Scorer(self.config.get("rubric", {}))
        self.analyzers = {
            "syntax": SyntaxAnalyzer(),
            "style": StyleAnalyzer(),
        }
    
    def _load_config(self, path: str) -> Dict:
        with open(path, 'r') as f:
            return yaml.safe_load(f)
    
    def _init_model(self) -> BaseLLMModel:
        model_name = self.config["model"]["name"]
        model_path = self.config["model"]["path"]
        
        if "qwen" in model_name.lower():
            return QwenCoderModel(model_path)
        # Add more model types here
        raise ValueError(f"Unsupported model: {model_name}")
    
    def grade(self, submission: Dict) -> Dict:
        """
        Grade a code submission
        
        Args:
            submission: {
                "code": str,          # Source code
                "language": str,      # Programming language
                "problem": str,       # Problem description
                "test_cases": List,   # Test cases
                "student_id": str     # Student identifier
            }
        
        Returns:
            Dict with scores, feedback, and details
        """
        results = {}
        
        # Step 1: Syntax Analysis
        syntax_result = self.analyzers["syntax"].analyze(
            submission["code"], 
            submission["language"]
        )
        results["syntax"] = syntax_result
        
        # Step 2: Code Execution
        exec_result = self.executor.run(
            submission["code"],
            submission["language"],
            submission.get("input", "")
        )
        results["execution"] = exec_result
        
        # Step 3: Test Cases
        test_results = self.test_runner.run_all(
            submission["code"],
            submission["language"],
            submission["test_cases"]
        )
        results["tests"] = test_results
        
        # Step 4: LLM Analysis
        llm_feedback = self.model.analyze_code(
            code=submission["code"],
            problem=submission["problem"],
            test_results=test_results,
            syntax_result=syntax_result
        )
        results["llm_analysis"] = llm_feedback
        
        # Step 5: Scoring
        final_score = self.scorer.calculate(results, submission)
        
        return {
            "student_id": submission["student_id"],
            "total_score": final_score["total"],
            "breakdown": final_score["breakdown"],
            "feedback": llm_feedback["feedback"],
            "suggestions": llm_feedback["suggestions"],
            "details": results
        }
    
    def grade_batch(self, submissions: List[Dict]) -> List[Dict]:
        """Grade multiple submissions"""
        return [self.grade(sub) for sub in submissions]`,
  },
  {
    id: 'executor',
    name: 'core/executor.py',
    description: 'Thực thi code trong sandbox an toàn',
    color: 'indigo',
    code: `"""
Code Executor - Sandboxed execution environment
Chạy code an toàn trong môi trường cách ly
"""
import subprocess
import tempfile
import os
from typing import Dict, Optional
from dataclasses import dataclass


@dataclass
class ExecutionResult:
    success: bool
    stdout: str
    stderr: str
    return_code: int
    execution_time: float
    memory_usage: Optional[float] = None


class CodeExecutor:
    """Execute code in a sandboxed environment"""
    
    SUPPORTED_LANGUAGES = {
        "python": {"ext": ".py", "cmd": ["python3"]},
        "cpp": {"ext": ".cpp", "cmd": ["g++", "-o"]},
        "java": {"ext": ".java", "cmd": ["javac"]},
        "javascript": {"ext": ".js", "cmd": ["node"]},
    }
    
    def __init__(self, timeout: int = 10, max_memory_mb: int = 256):
        self.timeout = timeout
        self.max_memory_mb = max_memory_mb
    
    def run(self, code: str, language: str, stdin: str = "") -> ExecutionResult:
        """Execute code and return results"""
        if language not in self.SUPPORTED_LANGUAGES:
            return ExecutionResult(
                success=False, stdout="", 
                stderr=f"Unsupported language: {language}",
                return_code=-1, execution_time=0
            )
        
        lang_config = self.SUPPORTED_LANGUAGES[language]
        
        with tempfile.TemporaryDirectory() as tmpdir:
            # Write code to temp file
            code_file = os.path.join(tmpdir, f"solution{lang_config['ext']}")
            with open(code_file, 'w') as f:
                f.write(code)
            
            try:
                if language == "python":
                    return self._run_python(code_file, stdin)
                elif language == "cpp":
                    return self._run_cpp(code_file, stdin, tmpdir)
                elif language == "java":
                    return self._run_java(code_file, stdin, tmpdir)
                elif language == "javascript":
                    return self._run_javascript(code_file, stdin)
                    
            except subprocess.TimeoutExpired:
                return ExecutionResult(
                    success=False, stdout="",
                    stderr="Time Limit Exceeded",
                    return_code=-1, execution_time=self.timeout
                )
    
    def _run_python(self, code_file: str, stdin: str) -> ExecutionResult:
        import time
        start = time.time()
        
        result = subprocess.run(
            ["python3", code_file],
            input=stdin, capture_output=True, text=True,
            timeout=self.timeout,
            env={"PATH": "/usr/bin", "HOME": "/tmp"}
        )
        
        elapsed = time.time() - start
        return ExecutionResult(
            success=(result.returncode == 0),
            stdout=result.stdout,
            stderr=result.stderr,
            return_code=result.returncode,
            execution_time=elapsed
        )
    
    def _run_cpp(self, code_file: str, stdin: str, tmpdir: str) -> ExecutionResult:
        import time
        
        # Compile
        exe_file = os.path.join(tmpdir, "solution")
        compile_result = subprocess.run(
            ["g++", "-O2", "-o", exe_file, code_file],
            capture_output=True, text=True, timeout=30
        )
        
        if compile_result.returncode != 0:
            return ExecutionResult(
                success=False, stdout="",
                stderr=compile_result.stderr,
                return_code=compile_result.returncode,
                execution_time=0
            )
        
        # Run
        start = time.time()
        result = subprocess.run(
            [exe_file], input=stdin, capture_output=True, text=True,
            timeout=self.timeout
        )
        elapsed = time.time() - start
        
        return ExecutionResult(
            success=(result.returncode == 0),
            stdout=result.stdout,
            stderr=result.stderr,
            return_code=result.returncode,
            execution_time=elapsed
        )
    
    def _run_java(self, code_file: str, stdin: str, tmpdir: str) -> ExecutionResult:
        import time
        
        # Compile
        compile_result = subprocess.run(
            ["javac", "-d", tmpdir, code_file],
            capture_output=True, text=True, timeout=30
        )
        
        if compile_result.returncode != 0:
            return ExecutionResult(
                success=False, stdout="",
                stderr=compile_result.stderr,
                return_code=compile_result.returncode,
                execution_time=0
            )
        
        # Run
        start = time.time()
        result = subprocess.run(
            ["java", "-cp", tmpdir, "Solution"],
            input=stdin, capture_output=True, text=True,
            timeout=self.timeout
        )
        elapsed = time.time() - start
        
        return ExecutionResult(
            success=(result.returncode == 0),
            stdout=result.stdout,
            stderr=result.stderr,
            return_code=result.returncode,
            execution_time=elapsed
        )
    
    def _run_javascript(self, code_file: str, stdin: str) -> ExecutionResult:
        import time
        start = time.time()
        
        result = subprocess.run(
            ["node", code_file],
            input=stdin, capture_output=True, text=True,
            timeout=self.timeout
        )
        elapsed = time.time() - start
        
        return ExecutionResult(
            success=(result.returncode == 0),
            stdout=result.stdout,
            stderr=result.stderr,
            return_code=result.returncode,
            execution_time=elapsed
        )`,
  },
  {
    id: 'models',
    name: 'models/qwen_coder.py',
    description: 'Integration với Qwen2.5-Coder (7B)',
    color: 'purple',
    code: `"""
Qwen2.5-Coder Model Integration
Sử dụng Qwen2.5-Coder-7B để phân tích và chấm điểm code
Model size: ~7B parameters - fits on Kaggle T4/P100 GPU
"""
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from typing import Dict, List
from models.base import BaseLLMModel


class QwenCoderModel(BaseLLMModel):
    """Qwen2.5-Coder model for code analysis and grading"""
    
    def __init__(self, model_path: str = "Qwen/Qwen2.5-Coder-7B-Instruct"):
        self.model_path = model_path
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self._load_model()
    
    def _load_model(self):
        """Load model with optimized settings for Kaggle"""
        self.tokenizer = AutoTokenizer.from_pretrained(
            self.model_path, 
            trust_remote_code=True
        )
        
        self.model = AutoModelForCausalLM.from_pretrained(
            self.model_path,
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
            device_map="auto" if self.device == "cuda" else None,
            trust_remote_code=True,
            low_cpu_mem_usage=True
        )
        
        if self.device == "cpu":
            self.model.to(self.device)
        
        self.model.eval()
        print(f"✅ Qwen2.5-Coder loaded on {self.device}")
    
    def analyze_code(
        self, 
        code: str, 
        problem: str,
        test_results: Dict,
        syntax_result: Dict
    ) -> Dict:
        """Analyze code quality and provide feedback"""
        
        prompt = self._build_grading_prompt(
            code, problem, test_results, syntax_result
        )
        
        # Generate response
        inputs = self.tokenizer(
            prompt, 
            return_tensors="pt",
            max_length=4096,
            truncation=True
        ).to(self.device)
        
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=1024,
                temperature=0.3,
                do_sample=True,
                top_p=0.9,
                pad_token_id=self.tokenizer.eos_token_id
            )
        
        response = self.tokenizer.decode(
            outputs[0][inputs.input_ids.shape[1]:], 
            skip_special_tokens=True
        )
        
        return self._parse_response(response)
    
    def _build_grading_prompt(
        self, code: str, problem: str,
        test_results: Dict, syntax_result: Dict
    ) -> str:
        """Build structured prompt for grading"""
        
        test_pass_rate = test_results.get("pass_rate", 0)
        syntax_errors = syntax_result.get("errors", [])
        
        return f"""You are an expert programming instructor. Analyze and grade the following code submission.

## Problem Statement:
{problem}

## Student's Code:
\`\`\`
{code}
\`\`\`

## Test Results:
- Pass Rate: {test_pass_rate * 100:.1f}%
- Details: {test_results.get("details", "N/A")}

## Syntax Analysis:
- Errors: {len(syntax_errors)}
- Warnings: {syntax_result.get("warnings", [])}

## Instructions:
Provide your analysis in the following JSON format:
{{
    "correctness": {{
        "score": <0-100>,
        "explanation": "<why this score>"
    }},
    "code_quality": {{
        "score": <0-100>,
        "explanation": "<readability, naming, structure>"
    }},
    "efficiency": {{
        "score": <0-100>,
        "explanation": "<time/space complexity analysis>"
    }},
    "documentation": {{
        "score": <0-100>,
        "explanation": "<comments, docstrings, clarity>"
    }},
    "feedback": "<detailed feedback for student>",
    "suggestions": ["<improvement 1>", "<improvement 2>", ...]
}}

Be fair, constructive, and specific in your feedback."""
    
    def _parse_response(self, response: str) -> Dict:
        """Parse LLM response into structured format"""
        import json
        import re
        
        # Try to extract JSON from response
        json_match = re.search(r'\\{[\\s\\S]*\\}', response)
        if json_match:
            try:
                return json.loads(json_match.group())
            except json.JSONDecodeError:
                pass
        
        # Fallback: return raw response
        return {
            "feedback": response,
            "suggestions": [],
            "raw": True
        }`,
  },
  {
    id: 'scorer',
    name: 'core/scorer.py',
    description: 'Tính toán điểm số dựa trên rubric',
    color: 'pink',
    code: `"""
Scoring Module
Tính toán điểm số cuối cùng dựa trên rubric
"""
from typing import Dict, List


class Scorer:
    """Calculate final scores based on rubric weights"""
    
    DEFAULT_RUBRIC = {
        "correctness": {"weight": 0.40, "description": "Code chạy đúng, pass test cases"},
        "code_quality": {"weight": 0.20, "description": "Clean code, naming, structure"},
        "efficiency": {"weight": 0.20, "description": "Time & space complexity"},
        "documentation": {"weight": 0.20, "description": "Comments, docstrings, README"},
    }
    
    def __init__(self, rubric: Dict = None):
        self.rubric = rubric or self.DEFAULT_RUBRIC
    
    def calculate(self, results: Dict, submission: Dict) -> Dict:
        """
        Calculate final score
        
        Returns:
            {
                "total": float,  # 0-100
                "breakdown": {
                    "correctness": {"score": float, "weight": float, "weighted": float},
                    ...
                },
                "grade": str,  # A, B, C, D, F
                "passed": bool
            }
        """
        breakdown = {}
        total = 0.0
        
        # Correctness: based on test pass rate
        test_results = results.get("tests", {})
        correctness_score = test_results.get("pass_rate", 0) * 100
        
        # If syntax errors, cap correctness
        syntax = results.get("syntax", {})
        if syntax.get("errors"):
            correctness_score *= 0.5
        
        # If execution failed
        exec_result = results.get("execution", {})
        if not exec_result.get("success", False):
            correctness_score *= 0.3
        
        # LLM-analyzed scores
        llm_analysis = results.get("llm_analysis", {})
        quality_score = llm_analysis.get("code_quality", {}).get("score", 50)
        efficiency_score = llm_analysis.get("efficiency", {}).get("score", 50)
        doc_score = llm_analysis.get("documentation", {}).get("score", 50)
        
        # Calculate weighted scores
        categories = {
            "correctness": correctness_score,
            "code_quality": quality_score,
            "efficiency": efficiency_score,
            "documentation": doc_score,
        }
        
        for category, score in categories.items():
            weight = self.rubric.get(category, {}).get("weight", 0.25)
            weighted = score * weight
            breakdown[category] = {
                "score": round(score, 1),
                "weight": weight,
                "weighted": round(weighted, 1),
            }
            total += weighted
        
        # Determine grade
        grade = self._get_grade(total)
        
        return {
            "total": round(total, 1),
            "breakdown": breakdown,
            "grade": grade,
            "passed": total >= 50,
        }
    
    def _get_grade(self, score: float) -> str:
        """Convert numeric score to letter grade"""
        if score >= 90:
            return "A"
        elif score >= 80:
            return "B"
        elif score >= 70:
            return "C"
        elif score >= 60:
            return "D"
        else:
            return "F"
    
    def get_ranking(self, results: List[Dict]) -> List[Dict]:
        """Rank students by score"""
        sorted_results = sorted(
            results, 
            key=lambda x: x["total_score"], 
            reverse=True
        )
        
        for i, result in enumerate(sorted_results):
            result["rank"] = i + 1
        
        return sorted_results`,
  },
  {
    id: 'test_runner',
    name: 'test_runner/runner.py',
    description: 'Chạy test cases và so sánh output',
    color: 'green',
    code: `"""
Test Runner Module
Chạy test cases và so sánh kết quả
"""
import subprocess
import tempfile
import os
from typing import Dict, List
from dataclasses import dataclass


@dataclass
class TestCaseResult:
    test_id: int
    passed: bool
    expected_output: str
    actual_output: str
    error: str = ""
    execution_time: float = 0.0


class TestRunner:
    """Run test cases against student code"""
    
    def __init__(self, timeout: int = 5):
        self.timeout = timeout
    
    def run_all(
        self, 
        code: str, 
        language: str, 
        test_cases: List[Dict]
    ) -> Dict:
        """
        Run all test cases
        
        Args:
            test_cases: [
                {
                    "id": 1,
                    "input": "5\\n3 1 4 1 5",
                    "expected_output": "14",
                    "description": "Basic test case"
                },
                ...
            ]
        
        Returns:
            {
                "total": int,
                "passed": int,
                "failed": int,
                "pass_rate": float,
                "results": [TestCaseResult, ...],
                "details": str
            }
        """
        results = []
        
        for tc in test_cases:
            result = self._run_single(code, language, tc)
            results.append(result)
        
        passed = sum(1 for r in results if r.passed)
        total = len(results)
        
        return {
            "total": total,
            "passed": passed,
            "failed": total - passed,
            "pass_rate": passed / total if total > 0 else 0,
            "results": [
                {
                    "test_id": r.test_id,
                    "passed": r.passed,
                    "expected": r.expected_output[:200],
                    "actual": r.actual_output[:200],
                    "error": r.error[:200] if r.error else "",
                }
                for r in results
            ],
            "details": f"{passed}/{total} test cases passed"
        }
    
    def _run_single(
        self, code: str, language: str, test_case: Dict
    ) -> TestCaseResult:
        """Run a single test case"""
        test_id = test_case.get("id", 0)
        expected = test_case.get("expected_output", "").strip()
        input_data = test_case.get("input", "")
        
        try:
            # Execute code with input
            actual = self._execute(code, language, input_data)
            
            # Compare outputs (normalize whitespace)
            passed = self._compare_outputs(expected, actual)
            
            return TestCaseResult(
                test_id=test_id,
                passed=passed,
                expected_output=expected,
                actual_output=actual.strip(),
            )
            
        except subprocess.TimeoutExpired:
            return TestCaseResult(
                test_id=test_id,
                passed=False,
                expected_output=expected,
                actual_output="",
                error="Time Limit Exceeded",
            )
        except Exception as e:
            return TestCaseResult(
                test_id=test_id,
                passed=False,
                expected_output=expected,
                actual_output="",
                error=str(e),
            )
    
    def _execute(self, code: str, language: str, stdin: str) -> str:
        """Execute code and return stdout"""
        with tempfile.NamedTemporaryFile(
            mode='w', suffix='.py', delete=False
        ) as f:
            f.write(code)
            f.flush()
            
            result = subprocess.run(
                ["python3", f.name],
                input=stdin,
                capture_output=True,
                text=True,
                timeout=self.timeout
            )
            
            os.unlink(f.name)
            
            if result.returncode != 0:
                raise RuntimeError(result.stderr)
            
            return result.stdout
    
    def _compare_outputs(self, expected: str, actual: str) -> bool:
        """Compare expected and actual output with normalization"""
        # Normalize: strip whitespace, normalize line endings
        norm_expected = self._normalize(expected)
        norm_actual = self._normalize(actual)
        
        return norm_expected == norm_actual
    
    def _normalize(self, text: str) -> str:
        """Normalize output for comparison"""
        lines = text.strip().split('\\n')
        normalized = []
        for line in lines:
            # Remove trailing whitespace, collapse multiple spaces
            line = ' '.join(line.split())
            normalized.append(line)
        return '\\n'.join(normalized)`,
  },
];

export default function ModuleSection() {
  const [activeModule, setActiveModule] = useState(modules[0].id);
  const [copied, setCopied] = useState(false);

  const currentModule = modules.find((m) => m.id === activeModule)!;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentModule.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Chi Tiết Modules
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Mỗi module đảm nhận một chức năng riêng biệt, dễ test và mở rộng.
            Click vào từng module để xem code chi tiết.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Module list */}
          <div className="lg:col-span-1 space-y-2">
            {modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  activeModule === mod.id
                    ? 'bg-violet-500/10 border-violet-500/30 shadow-lg shadow-violet-500/5'
                    : 'bg-gray-800/30 border-white/5 hover:border-white/20 hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Code2 className={`w-4 h-4 ${activeModule === mod.id ? 'text-violet-400' : 'text-gray-500'}`} />
                  <span className={`font-mono text-sm ${activeModule === mod.id ? 'text-violet-300' : 'text-gray-400'}`}>
                    {mod.name}
                  </span>
                  <ChevronRight className={`w-4 h-4 ml-auto ${activeModule === mod.id ? 'text-violet-400' : 'text-gray-600'}`} />
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-6">{mod.description}</p>
              </button>
            ))}
          </div>

          {/* Code viewer */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 rounded-2xl border border-white/10 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gray-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  <span className="text-sm text-gray-400 ml-2 font-mono">{currentModule.name}</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
                <pre className="text-sm font-mono text-gray-300 leading-relaxed whitespace-pre">
                  {currentModule.code}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
