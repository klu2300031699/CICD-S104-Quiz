import React from "react";
import { QuizQuestion } from "@/lib/quizData";
import { cn } from "@/lib/utils";

export type ReviewListProps = {
  questions: QuizQuestion[];
  answers: (number | null)[];
};

export function ReviewList({ questions, answers }: ReviewListProps) {
  return (
    <div className="mt-10 space-y-4">
      {questions.map((q, idx) => {
        const selected = answers[idx];
        const isCorrect = selected !== null && selected === q.answerIndex;
        const status = selected === null ? "Unanswered" : isCorrect ? "Correct" : "Wrong";
        return (
          <div key={q.id} className="rounded-xl border bg-background p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="text-base font-semibold leading-snug md:text-lg">{idx + 1}. {q.question}</h3>
              <span className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                status === "Correct" && "bg-green-500/10 text-green-600",
                status === "Wrong" && "bg-red-500/10 text-red-600",
                status === "Unanswered" && "bg-muted text-muted-foreground"
              )}>
                {status}
              </span>
            </div>
            <div className="mt-4 grid gap-2">
              {q.options.map((opt, i) => {
                const isSel = selected === i;
                const isAns = q.answerIndex === i;
                return (
                  <div
                    key={i}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm",
                      isAns && "border-green-500/60 bg-green-500/5",
                      isSel && !isAns && "border-red-500/60 bg-red-500/5",
                    )}
                  >
                    <span className="mr-2 inline-grid size-5 place-content-center rounded-full border text-[11px] font-semibold text-muted-foreground">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                    {isAns && <span className="ml-2 text-xs text-green-600">(Correct)</span>}
                    {isSel && !isAns && <span className="ml-2 text-xs text-red-600">(Your choice)</span>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
