import type * as React from "react"

export const InterviewUserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Candidate - nervous expression */}
      <circle cx="7" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M3 20v-1.5a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3V20" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Nervous face - worried eyebrows and small mouth */}
      <path d="M6 7.5l0.5-0.3M7.5 7.5l-0.5-0.3" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="6.3" cy="7.8" r="0.3" fill="currentColor" />
      <circle cx="7.7" cy="7.8" r="0.3" fill="currentColor" />
      <path d="M6.8 8.8c0.2-0.1 0.4-0.1 0.6 0" stroke="currentColor" strokeWidth="1" fill="none" />

      {/* Interviewer - professional expression */}
      <circle cx="17" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M13 20v-1.5a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3V20" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Professional face - neutral expression */}
      <circle cx="16.3" cy="7.8" r="0.3" fill="currentColor" />
      <circle cx="17.7" cy="7.8" r="0.3" fill="currentColor" />
      <path d="M16.5 8.8h1" stroke="currentColor" strokeWidth="1" fill="none" />

      {/* Speech bubbles */}
      <ellipse cx="9.5" cy="4" rx="2" ry="1.2" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M8.5 5l-1 1.5" stroke="currentColor" strokeWidth="1" fill="none" />
      <ellipse cx="14.5" cy="4" rx="2" ry="1.2" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M15.5 5l1 1.5" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  )
}

export const InterviewManagerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Manager - confident expression with tie */}
      <circle cx="7" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M3 20v-1.5a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3V20" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Confident face - raised eyebrows and slight smile */}
      <path d="M6 7.2l0.5 0.3M7.5 7.2l-0.5 0.3" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="6.3" cy="7.8" r="0.3" fill="currentColor" />
      <circle cx="7.7" cy="7.8" r="0.3" fill="currentColor" />
      <path d="M6.5 8.8c0.3 0.2 0.7 0.2 1 0" stroke="currentColor" strokeWidth="1" fill="none" />
      {/* Tie */}
      <path d="M7 10.5v3l-0.5 1 0.5 0.5 0.5-0.5-0.5-1v-3" stroke="currentColor" strokeWidth="1" fill="none" />

      {/* Candidate - attentive expression */}
      <circle cx="17" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M13 20v-1.5a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3V20" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Attentive face - focused expression */}
      <circle cx="16.3" cy="7.8" r="0.3" fill="currentColor" />
      <circle cx="17.7" cy="7.8" r="0.3" fill="currentColor" />
      <ellipse cx="17" cy="8.8" rx="0.3" ry="0.2" stroke="currentColor" strokeWidth="1" fill="none" />

      {/* Speech bubbles with question marks */}
      <ellipse cx="9.5" cy="4" rx="2" ry="1.2" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M8.5 5l-1 1.5" stroke="currentColor" strokeWidth="1" fill="none" />
      <path
        d="M9.2 3.5c0.2-0.2 0.4-0.2 0.6 0s0.2 0.4 0 0.6c-0.1 0.1-0.2 0.2-0.3 0.4"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
      />
      <circle cx="9.5" cy="4.8" r="0.1" fill="currentColor" />

      <ellipse cx="14.5" cy="4" rx="2" ry="1.2" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M15.5 5l1 1.5" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  )
}

export const InterviewHRIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* HR Person - friendly expression with clipboard */}
      <circle cx="7" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M3 20v-1.5a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3V20" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Friendly face - warm smile and kind eyes */}
      <circle cx="6.3" cy="7.8" r="0.3" fill="currentColor" />
      <circle cx="7.7" cy="7.8" r="0.3" fill="currentColor" />
      <path d="M6.3 8.8c0.4 0.3 0.9 0.3 1.3 0" stroke="currentColor" strokeWidth="1" fill="none" />
      {/* Clipboard */}
      <rect x="1" y="12" width="3" height="4" rx="0.3" stroke="currentColor" strokeWidth="1" fill="none" />
      <line x1="1.5" y1="13" x2="3.5" y2="13" stroke="currentColor" strokeWidth="0.5" />
      <line x1="1.5" y1="14" x2="3.5" y2="14" stroke="currentColor" strokeWidth="0.5" />
      <line x1="1.5" y1="15" x2="3" y2="15" stroke="currentColor" strokeWidth="0.5" />

      {/* Candidate - hopeful expression */}
      <circle cx="17" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M13 20v-1.5a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3V20" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Hopeful face - slight smile and bright eyes */}
      <circle cx="16.3" cy="7.8" r="0.3" fill="currentColor" />
      <circle cx="17.7" cy="7.8" r="0.3" fill="currentColor" />
      <path d="M16.7 8.8c0.2 0.1 0.4 0.1 0.6 0" stroke="currentColor" strokeWidth="1" fill="none" />

      {/* Speech bubbles with checkmarks and hearts */}
      <ellipse cx="9.5" cy="4" rx="2" ry="1.2" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M8.5 5l-1 1.5" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M9 3.8l0.3 0.3 0.5-0.5" stroke="currentColor" strokeWidth="0.8" fill="none" />

      <ellipse cx="14.5" cy="4" rx="2" ry="1.2" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M15.5 5l1 1.5" stroke="currentColor" strokeWidth="1" fill="none" />
      <path
        d="M14.3 3.8c0.1-0.1 0.2-0.1 0.3 0l0.2 0.2 0.4-0.4c0.1-0.1 0.2-0.1 0.3 0"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
      />
    </svg>
  )
}
