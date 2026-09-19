/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import { ClarifyingQuestion } from '../types.js';

interface ClarifyingQuestionCardProps {
  question: ClarifyingQuestion;
  onAnswer: (field: string, value: string | number) => void;
}

export const ClarifyingQuestionCard: React.FC<ClarifyingQuestionCardProps> = ({
  question,
  onAnswer,
}) => {
  const isAnswered = question.answeredValue !== undefined && question.answeredValue !== null;

  return (
    <div
      id={`clarifying-card-${question.id}`}
      className={`rounded-xl p-4 border transition ${
        isAnswered
          ? 'bg-emerald-50/70 border-emerald-200'
          : 'bg-white border-amber-200/80 shadow-xs'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              isAnswered
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isAnswered ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <HelpCircle className="w-4 h-4" />
            )}
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">
              {question.question}
            </h4>
            <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
              {question.context}
            </p>
          </div>
        </div>

        {/* Confidence Boost Badge */}
        <div className="shrink-0 flex items-center space-x-1 px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-[10px] font-medium">
          <Zap className="w-3 h-3 text-amber-600" />
          <span>{question.impactOnConfidence}</span>
        </div>
      </div>

      {/* Options Chips */}
      <div className="mt-3 pt-2.5 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
        {question.options.map((opt, idx) => {
          const isSelected = question.answeredValue === opt.value;
          return (
            <button
              key={idx}
              type="button"
              id={`opt-${question.id}-${idx}`}
              onClick={() => onAnswer(question.field as string, opt.value)}
              className={`p-2 rounded-lg text-left transition border cursor-pointer ${
                isSelected
                  ? 'bg-emerald-800 text-white border-emerald-900 ring-1 ring-emerald-950/20 shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="text-xs font-semibold">{opt.label}</div>
              {opt.description && (
                <div
                  className={`text-[10px] mt-0.5 leading-snug ${
                    isSelected ? 'text-emerald-100' : 'text-stone-500'
                  }`}
                >
                  {opt.description}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
