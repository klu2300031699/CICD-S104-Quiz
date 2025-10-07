import { useEffect, useMemo, useRef, useState } from "react";
import { QUIZ_DURATION_SECONDS, QUIZ_TOTAL_QUESTIONS, type QuizQuestion, getQuizQuestions } from "@/lib/quizData";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ReviewList } from "@/components/quiz/ReviewList";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

type Results = {
  score: number;
  attempted: number;
  correct: number;
  timeTaken: number; // seconds
};

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function Index() {
  const { user } = useAuth();
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(QUIZ_TOTAL_QUESTIONS).fill(null));
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);
  const [results, setResults] = useState<Results | null>(null);
  const timerRef = useRef<number | null>(null);

  const questions: QuizQuestion[] = useMemo(() => getQuizQuestions(), [started]);

  // Timer
  useEffect(() => {
    if (!started || finished) return;
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(timerRef.current!);
          handleSubmit(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [started, finished]);

  const attempted = useMemo(() => answers.filter((a) => a !== null).length, [answers]);
  const progressPct = Math.round(((current + 1) / QUIZ_TOTAL_QUESTIONS) * 100);
  const timePct = Math.max(0, Math.min(100, Math.round((timeLeft / QUIZ_DURATION_SECONDS) * 100)));

  function startQuiz() {
    setStarted(true);
    setFinished(false);
    setCurrent(0);
    setAnswers(Array(QUIZ_TOTAL_QUESTIONS).fill(null));
    setTimeLeft(QUIZ_DURATION_SECONDS);
    setResults(null);
  }

  function handleSelect(i: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = i;
      return next;
    });
  }

  async function handleSubmit(auto = false) {
    const correct = answers.reduce((acc, sel, idx) => acc + (sel === questions[idx].answerIndex ? 1 : 0), 0);
    const res: Results = {
      score: Math.round((correct / QUIZ_TOTAL_QUESTIONS) * 100),
      attempted,
      correct,
      timeTaken: QUIZ_DURATION_SECONDS - timeLeft,
    };
    setFinished(true);
    setResults(res);
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (auto) {
      toast({ title: "Time's up", description: "Your quiz was submitted automatically." });
    } else {
      toast({ title: "Submitted", description: "Your answers have been submitted." });
    }

    // Try to persist if logged in
    try {
      if (user) {
        await api.createResult({
          score: res.score,
          attempted: res.attempted,
          correct: res.correct,
          timeTaken: res.timeTaken,
        });
      }
    } catch (e) {
      // ignore storage errors for UX, still keep local results view
    }
  }

  function jumpTo(index: number) {
    if (index >= 0 && index < QUIZ_TOTAL_QUESTIONS) setCurrent(index);
  }

  const q = questions[current];

  return (
    <div>
      {!started && !finished && (
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(900px_300px_at_0%_0%,hsl(var(--primary)/0.08),transparent_60%),radial-gradient(600px_200px_at_100%_10%,hsl(var(--primary)/0.08),transparent_60%)]" />
          <div className="container relative grid min-h-[calc(100vh-8rem)] place-items-center py-16">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              CICD-Knowledge Quiz Portal
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Test your knowledge with our comprehensive 20-question quiz
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <Button size="lg" onClick={startQuiz} className="px-8">
                  Start Quiz
                </Button>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-4 text-left md:grid-cols-3">
                <div className="rounded-xl border bg-card p-5">
                  <div className="text-sm font-semibold">Format</div>
                  <div className="mt-1 text-sm text-muted-foreground">20 Multiple Choice Questions</div>
                </div>
                <div className="rounded-xl border bg-card p-5">
                  <div className="text-sm font-semibold">Duration</div>
                  <div className="mt-1 text-sm text-muted-foreground">30 Minutes</div>
                </div>
                <div className="rounded-xl border bg-card p-5">
                  <div className="text-sm font-semibold">Scoring</div>
                  <div className="mt-1 text-sm text-muted-foreground">5% per correct answer</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {started && !finished && (
        <section className="container py-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Quiz in Progress</h2>
              <p className="text-sm text-muted-foreground">Attempted {attempted}/{QUIZ_TOTAL_QUESTIONS}</p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Time left</span>
                <span className="tabular-nums font-semibold text-foreground">{formatTime(timeLeft)}</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${100 - timePct}%` }} />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr,280px]">
            <QuestionCard
              index={current}
              total={QUIZ_TOTAL_QUESTIONS}
              question={q.question}
              options={q.options}
              selectedIndex={answers[current]}
              onSelect={handleSelect}
            />

            <aside className="order-first md:order-none">
              <div className="rounded-2xl border bg-card p-4">
                <div className="mb-3 text-sm font-semibold">Questions</div>
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-4">
                  {questions.map((_, i) => {
                    const sel = answers[i];
                    const isCurrent = i === current;
                    return (
                      <button
                        key={i}
                        onClick={() => jumpTo(i)}
                        className={
                          "relative aspect-square rounded-lg border text-xs font-semibold transition hover:bg-accent" +
                          (isCurrent ? " ring-2 ring-ring" : "") +
                          (sel !== null ? " bg-primary/10 border-primary/50" : " bg-background")
                        }
                        aria-label={`Question ${i + 1}`}
                      >
                        <span className="absolute inset-0 grid place-content-center">{i + 1}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button variant="secondary" onClick={() => jumpTo(Math.max(0, current - 1))} disabled={current === 0}>
                    Previous
                  </Button>
                  <Button onClick={() => jumpTo(Math.min(QUIZ_TOTAL_QUESTIONS - 1, current + 1))} disabled={current === QUIZ_TOTAL_QUESTIONS - 1}>
                    Next
                  </Button>
                </div>
                <Button className="mt-4 w-full" onClick={() => handleSubmit(false)}>
                  Submit Quiz
                </Button>
              </div>
            </aside>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">Progress {progressPct}%</div>
        </section>
      )}

      {finished && results && (
        <section className="container py-16">
          <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-8 text-center shadow-brand">
            <h2 className="text-3xl font-extrabold tracking-tight">Results</h2>
            <p className="mt-2 text-muted-foreground">Your 20‑question exam summary</p>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl border bg-background p-4">
                <div className="text-xs uppercase text-muted-foreground">Score</div>
                <div className="mt-1 text-2xl font-bold">{results.score}%</div>
              </div>
              <div className="rounded-xl border bg-background p-4">
                <div className="text-xs uppercase text-muted-foreground">Correct</div>
                <div className="mt-1 text-2xl font-bold">{results.correct}</div>
              </div>
              <div className="rounded-xl border bg-background p-4">
                <div className="text-xs uppercase text-muted-foreground">Attempted</div>
                <div className="mt-1 text-2xl font-bold">{results.attempted}</div>
              </div>
              <div className="rounded-xl border bg-background p-4">
                <div className="text-xs uppercase text-muted-foreground">Time Taken</div>
                <div className="mt-1 text-2xl font-bold">{formatTime(results.timeTaken)}</div>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button onClick={startQuiz}>Retake Quiz</Button>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-4xl">
            <h3 className="text-xl font-semibold">Review Answers</h3>
            <p className="mt-1 text-sm text-muted-foreground">See which questions you got right or wrong. Correct answers are highlighted.</p>
            <ReviewList questions={questions} answers={answers} />
          </div>
        </section>
      )}
    </div>
  );
}
