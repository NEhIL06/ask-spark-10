import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  text: string;
  difficulty: QuestionDifficulty;
  timeLimit: number; // in seconds
}

export interface Answer {
  questionId: string;
  text: string;
  timeUsed: number;
  timestamp: Date;
}

export interface CandidateInfo {
  name: string;
  email: string;
  phone: string;
  resumeUrl?: string;
}

export interface InterviewState {
  // Candidate info
  candidateInfo: CandidateInfo | null;
  setCandidateInfo: (info: CandidateInfo) => void;

  // Interview progress
  currentQuestionIndex: number;
  questions: Question[];
  answers: Answer[];
  isInterviewActive: boolean;
  isInterviewComplete: boolean;

  // Timer state
  timeRemaining: number;
  isTimerActive: boolean;

  // Scoring
  finalScore: number | null;
  summary: string | null;

  // Actions
  startInterview: (questions: Question[]) => void;
  submitAnswer: (answer: Answer) => void;
  nextQuestion: () => void;
  setTimeRemaining: (time: number) => void;
  setTimerActive: (active: boolean) => void;
  completeInterview: (score: number, summary: string) => void;
  resetInterview: () => void;
  continueInterview: () => void;
}

const INITIAL_STATE = {
  candidateInfo: null,
  currentQuestionIndex: 0,
  questions: [],
  answers: [],
  isInterviewActive: false,
  isInterviewComplete: false,
  timeRemaining: 0,
  isTimerActive: false,
  finalScore: null,
  summary: null,
};

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setCandidateInfo: (info) => set({ candidateInfo: info }),

      startInterview: (questions) =>
        set({
          questions,
          currentQuestionIndex: 0,
          answers: [],
          isInterviewActive: true,
          isInterviewComplete: false,
          timeRemaining: questions[0]?.timeLimit || 0,
          isTimerActive: true,
          finalScore: null,
          summary: null,
        }),

      submitAnswer: (answer) => {
        const { answers } = get();
        set({ answers: [...answers, answer] });
      },

      nextQuestion: () => {
        const { currentQuestionIndex, questions } = get();
        const nextIndex = currentQuestionIndex + 1;

        if (nextIndex < questions.length) {
          set({
            currentQuestionIndex: nextIndex,
            timeRemaining: questions[nextIndex].timeLimit,
            isTimerActive: true,
          });
        } else {
          set({
            isInterviewActive: false,
            isTimerActive: false,
          });
        }
      },

      setTimeRemaining: (time) => set({ timeRemaining: time }),

      setTimerActive: (active) => set({ isTimerActive: active }),

      completeInterview: (score, summary) =>
        set({
          finalScore: score,
          summary,
          isInterviewComplete: true,
          isInterviewActive: false,
          isTimerActive: false,
        }),

      resetInterview: () => set(INITIAL_STATE),

      continueInterview: () => {
        const { questions, currentQuestionIndex } = get();
        if (questions.length > 0 && currentQuestionIndex < questions.length) {
          set({ isTimerActive: true });
        }
      },
    }),
    {
      name: 'interview-storage',
    }
  )
);
