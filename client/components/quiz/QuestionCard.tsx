import React from "react";
import { cn } from "@/lib/utils";

export type QuestionCardProps = {
  index: number;
  total: number;
  question: string;
  options: string[];
  selectedIndex: number | null;
  onSelect: (i: number) => void;
};

export function QuestionCard({ index, total, question, options, selectedIndex, onSelect }: QuestionCardProps) {
  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
        <span>Question {index + 1} of {total}</span>
        <span>Attempt all questions</span>
      </div>
      <div className="rounded-2xl border bg-card p-6 shadow-brand">
        <h3 className="text-lg font-semibold leading-snug md:text-xl">{question}</h3>
        <div className="mt-6 grid gap-3">
          {options.map((opt, i) => {
            const active = selectedIndex === i;
            return (
              <button
                key={i}
                onClick={() => onSelect(i)}
                className={cn(
                  "group relative w-full rounded-xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "border-primary/60 bg-primary/10 text-foreground ring-0"
                    : "border-border bg-background hover:bg-accent"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "grid size-5 place-content-center rounded-full border text-xs font-semibold transition",
                    active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30 text-muted-foreground"
                  )}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
