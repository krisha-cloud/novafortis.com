import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Play, CheckCircle2, XCircle, ArrowRight, Brain, Trophy } from "lucide-react";
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

  const [newTitle, setNewTitle] = useState("");
  const [newQuestions, setNewQuestions] = useState<Question[]>([]);
  const [qText, setQText] = useState("");
  const [opts, setOpts] = useState(["", "", "", ""]);
  const [correctIdx, setCorrectIdx] = useState(0);

  const addQuestion = () => {
    if (!qText.trim() || opts.some((o) => !o.trim())) return;
    setNewQuestions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), question: qText, options: [...opts], correctIndex: correctIdx },
    ]);
    setQText("");
    setOpts(["", "", "", ""]);
    setCorrectIdx(0);
  };

  const saveQuiz = () => {
    if (!newTitle.trim() || newQuestions.length === 0) return;
    setQuizzes((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: newTitle, questions: newQuestions },
    ]);
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

  // Results
  if (playing && activeQuiz && finished) {
    const pct = Math.round((score / activeQuiz.questions.length) * 100);
    return (
      <div className="max-w-xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="glass-card p-14 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-accent to-[hsl(185,90%,48%)]" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Trophy className="w-16 h-16 mx-auto mb-6 text-[hsl(38,92%,50%)]" />
          </motion.div>
          <h2 className="text-3xl font-display font-extrabold mb-2">Quiz Complete!</h2>
          <div className="text-7xl font-display font-bold text-gradient my-6">{pct}%</div>
          <p className="text-lg text-muted-foreground mb-2">
            {score}/{activeQuiz.questions.length} correct
          </p>
          <p className="text-muted-foreground mb-8">
            {pct === 100 ? "Perfect score! 🎉" : pct >= 70 ? "Great work! 👏" : "Keep studying! 💪"}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => startQuiz(activeQuiz.id)} variant="outline" className="rounded-xl">
              Retry
            </Button>
            <Button onClick={() => setPlaying(null)} className="gradient-primary text-primary-foreground rounded-xl">
              Back to Quizzes
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Playing
  if (playing && activeQuiz && question) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setPlaying(null)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back
          </button>
          <span className="text-sm font-medium text-primary glass-card px-3 py-1">
            Score: {score}
          </span>
        </div>

        {/* Progress */}
        <div className="glass-card p-1 rounded-full mb-8">
          <div
            className="h-1.5 gradient-primary rounded-full transition-all duration-500"
            style={{ width: `${((currentQ + 1) / activeQuiz.questions.length) * 100}%` }}
          />
        </div>

        <motion.div key={currentQ} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
            Question {currentQ + 1} of {activeQuiz.questions.length}
          </p>
          <h2 className="text-2xl font-display font-bold mb-8">{question.question}</h2>

          <div className="space-y-3 mb-8">
            {question.options.map((opt, i) => {
              const isCorrect = i === question.correctIndex;
              const isSelected = i === selected;
              const showResult = selected !== null;

              return (
                <motion.button
                  key={i}
                  whileHover={!showResult ? { scale: 1.01 } : {}}
                  whileTap={!showResult ? { scale: 0.99 } : {}}
                  onClick={() => answer(i)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 ${
                    !showResult
                      ? "glass-card-hover cursor-pointer"
                      : isCorrect
                      ? "border-primary/40 bg-primary/10 glow-primary"
                      : isSelected
                      ? "border-destructive/40 bg-destructive/10"
                      : "glass-card opacity-40"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${
                        showResult && isCorrect
                          ? "bg-primary text-primary-foreground"
                          : showResult && isSelected
                          ? "bg-destructive text-destructive-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 font-medium">{opt}</span>
                    {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-primary" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {selected !== null && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Button
                onClick={next}
                className="w-full gradient-primary text-primary-foreground rounded-xl h-12 font-semibold glow-primary"
              >
                {currentQ + 1 >= activeQuiz.questions.length ? "See Results" : "Next Question"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  // Creating
  if (creating) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto">
        <h1 className="text-2xl font-display font-extrabold mb-6">Create Quiz</h1>
        <Input
          placeholder="Quiz title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="mb-6 bg-secondary/50 border-border/30 rounded-xl h-12 text-lg font-display"
        />

        <div className="glass-card p-6 mb-4">
          <Input
            placeholder="Write your question..."
            value={qText}
            onChange={(e) => setQText(e.target.value)}
            className="mb-4 bg-secondary/50 border-border/30 rounded-xl"
          />
          <div className="grid grid-cols-2 gap-3 mb-4">
            {opts.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                <button
                  onClick={() => setCorrectIdx(i)}
                  className={`w-7 h-7 rounded-lg border-2 flex-shrink-0 transition-all duration-300 flex items-center justify-center ${
                    correctIdx === i
                      ? "border-primary bg-primary glow-primary"
                      : "border-muted-foreground/30 hover:border-muted-foreground"
                  }`}
                >
                  {correctIdx === i && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                </button>
                <Input
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  value={o}
                  onChange={(e) =>
                    setOpts((prev) => prev.map((p, j) => (j === i ? e.target.value : p)))
                  }
                  className="bg-secondary/50 border-border/30 rounded-xl"
                />
              </div>
            ))}
          </div>
          <Button onClick={addQuestion} variant="outline" className="w-full rounded-xl border-dashed">
            <Plus className="w-4 h-4 mr-2" /> Add Question
          </Button>
        </div>

        {newQuestions.length > 0 && (
          <p className="text-sm text-primary font-medium mb-4 glass-card inline-flex px-3 py-1.5 rounded-lg">
            ✓ {newQuestions.length} question(s) added
          </p>
        )}

        <div className="flex gap-3 mt-2">
          <Button variant="outline" onClick={() => setCreating(false)} className="flex-1 rounded-xl h-12">
            Cancel
          </Button>
          <Button onClick={saveQuiz} className="flex-1 gradient-primary text-primary-foreground rounded-xl h-12 glow-primary font-semibold">
            Save Quiz
          </Button>
        </div>
      </motion.div>
    );
  }

  // List
  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-extrabold">Quizzes</h1>
            <p className="text-sm text-muted-foreground mt-1">Test your knowledge</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={() => setCreating(true)} className="gradient-primary text-primary-foreground rounded-xl h-11 glow-primary">
              <Plus className="w-4 h-4 mr-2" /> Create Quiz
            </Button>
          </motion.div>
        </div>

        {quizzes.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <div className="w-20 h-20 rounded-3xl bg-secondary/50 flex items-center justify-center mx-auto mb-5">
              <Brain className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <p className="font-medium text-muted-foreground">No quizzes yet</p>
            <p className="text-sm text-muted-foreground/50 mt-1">Create your first quiz to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {quizzes.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card-hover p-6 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-display font-semibold text-lg">{q.title}</h3>
                  <p className="text-sm text-muted-foreground">{q.questions.length} questions</p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={() => startQuiz(q.id)} className="gradient-primary text-primary-foreground rounded-xl glow-primary">
                    <Play className="w-4 h-4 mr-2" /> Start
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Quiz;
