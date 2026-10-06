'use client'

import { useState, type ReactNode } from 'react'

export interface FaqQuestion {
  id: string
  /** The question as delivered (stega in preview). */
  question: string
  answer: ReactNode
}

/**
 * The FAQ accordion: real buttons with `aria-expanded` and `aria-controls`,
 * one panel per question. The page's first question starts open.
 */
export function FaqAccordion({
  questions,
  openFirst,
}: {
  questions: FaqQuestion[]
  openFirst: boolean
}) {
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(openFirst && questions[0] ? [questions[0].id] : []),
  )

  const toggle = (id: string) =>
    setOpen((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div>
      {questions.map((q, i) => {
        const expanded = open.has(q.id)
        return (
          <div key={q.id} className={`border-t ${i === 0 ? 'border-tinta' : 'border-linea'}`}>
            <h3 className="m-0">
              <button
                id={`${q.id}-b`}
                type="button"
                aria-expanded={expanded}
                aria-controls={`${q.id}-p`}
                onClick={() => toggle(q.id)}
                className="flex w-full cursor-pointer items-center justify-between gap-6 border-0 bg-transparent py-5 text-left font-story text-[20px] leading-[1.3] font-medium text-tinta lg:py-6 lg:text-[23px]"
              >
                {q.question}
                <span
                  aria-hidden="true"
                  className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-tinta ${expanded ? 'bg-tinta text-niebla' : 'bg-transparent text-tinta'}`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M5 12h14" />
                    {expanded ? null : <path d="M12 5v14" />}
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={`${q.id}-p`}
              role="region"
              aria-labelledby={`${q.id}-b`}
              hidden={!expanded}
              className="pr-0 pb-[26px] lg:pr-14"
            >
              {q.answer}
            </div>
          </div>
        )
      })}
      <div className="border-t border-linea" />
    </div>
  )
}
