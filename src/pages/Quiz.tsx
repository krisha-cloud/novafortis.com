import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Play, CheckCircle2, XCircle, ArrowRight, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface QuizData {
  id: string;
  title: string;
  questions: Question[];
}

const Quiz = () => {
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [creating, setCreating] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // Creation state
  const [newTitle, setNewTitle] = useState("");
  const [newQuestions, setNewQuestions] = useState<Question[]>([]);
  const [qText, setQText] = useState("");
  const [opts, setOpts] = useState(["", "", "", ""]);
  const [correctIdx, setCorrectIdx] = useState(0);

  const addQuestion = () => {
    if (!qText.trim() || opts.some((o) => !o.trim())) return;
    setNewQuestions((prev) => [...prev, { id: crypto.randomUUID(), question: qText, options: [...opts], correctIndex: correctIdx }]);
    setQText("");
    setOpts(["", "", "", ""]);
    setCorrectIdx(0);
  };

  const saveQuiz = () => {
    if (!newTitle.trim() || newQuestions.length === 0) return;
    setQuizzes((prev) => [...prev, { id: crypto.randomUUID(), title: newTitle, questions: newQuestions }]);
    setNewTitle("");
    setNewQuestions([]);
    setCreating(false);
  };

  const startQuiz = (id: string) => {
    setPlaying(id);
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  const activeQuiz = quizzes.find((q) => q.id === playing);
  const question = activeQuiz?.questions[currentQ];

  const answer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === question?.correctIndex) setScore((s) => s + 1);
  };

  const next = () => {
    if (!activeQuiz) return;
    if (currentQ + 1 >= activeQuiz.questions.length) {
      setFinished(true);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
    }
  };

  // Playing view
  if (playing && activeQuiz) {
    if (finished) {
      return (
        <div className="max-w-xl mx-auto text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-12">
            <h2 className="text-3xl font-display font-bold mb-4">Quiz Complete!</h2>
            <div className="text-6xl font-display font-bold text-gradient mb-4">{score}/{activeQuiz.questions.length}</div>
            <p className="text-muted-foreground mb-6">
              {score === activeQuiz.questions.length ? "Perfect score! 🎉" : score > activeQuiz.questions.length / 2 ? "Good job! 👏" : "Keep studying! 💪"}
            </p>
            <Button onClick={() => setPlaying(null)} variant="outline">Back to Quizzes</Button>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-muted-foreground">Question {currentQ + 1}/{activeQuiz.questions.length}</span>
          <span className="text-sm font-medium text-primary">Score: {score}</span>
        </div>
        <div className="w-full h-1 bg-secondary rounded-full mb-8">
          <div className="h-1 gradient-primary rounded-full transition-all" style={{ width: `${((currentQ + 1) / activeQuiz.questions.length) * 100}%` }} />
        </div>
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-xl font-display font-semibold mb-6">{question?.question}</h2>
          <div className="space-y-3 mb-6">
            {question?.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => answer(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected === null ? "glass-card hover:border-primary/50" :
                  i === question.correctIndex ? "border-primary bg-primary/10" :
                  i === selected ? "border-destructive bg-destructive/10" : "glass-card opacity-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{opt}</span>
                  {selected !== null && i === question.correctIndex && <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />}
                  {selected !== null && i === selected && i !== question.correctIndex && <XCircle className="w-5 h-5 text-destructive ml-auto" />}
                </div>
              </button>
            ))}
          </div>
          {selected !== null && (
            <Button onClick={next} className="gradient-primary text-primary-foreground w-full">
              {currentQ + 1 >= activeQuiz.questions.length ? "See Results" : "Next Question"} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </motion.div>
      </div>
    );
  }

  // Creation view
  if (creating) {
    return (
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-display font-bold mb-6">Create Quiz</h1>
        <Input placeholder="Quiz title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="mb-6 bg-secondary" />

        <div className="glass-card p-6 mb-4">
          <Input placeholder="Question" value={qText} onChange={(e) => setQText(e.target.value)} className="mb-4 bg-secondary" />
          <div className="grid grid-cols-2 gap-3 mb-4">
            {opts.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                <button
                  onClick={() => setCorrectIdx(i)}
                  className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-colors ${correctIdx === i ? "border-primary bg-primary" : "border-muted-foreground"}`}
                />
                <Input placeholder={`Option ${String.fromCharCode(65 + i)}`} value={o} onChange={(e) => setOpts((prev) => prev.map((p, j) => (j === i ? e.target.value : p)))} className="bg-secondary" />
              </div>
            ))}
          </div>
          <Button onClick={addQuestion} variant="outline" className="w-full">Add Question</Button>
        </div>

        {newQuestions.length > 0 && <p className="text-sm text-muted-foreground mb-4">{newQuestions.length} question(s) added</p>}
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setCreating(false)} className="flex-1">Cancel</Button>
          <Button onClick={saveQuiz} className="flex-1 gradient-primary text-primary-foreground">Save Quiz</Button>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold">Quizzes</h1>
          <Button onClick={() => setCreating(true)} className="gradient-primary text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" /> Create Quiz
          </Button>
        </div>

        {quizzes.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No quizzes yet. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {quizzes.map((q) => (
              <div key={q.id} className="glass-card p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold">{q.title}</h3>
                  <p className="text-sm text-muted-foreground">{q.questions.length} questions</p>
                </div>
                <Button onClick={() => startQuiz(q.id)} variant="outline" size="sm">
                  <Play className="w-4 h-4 mr-1" /> Start
                </Button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Quiz;
