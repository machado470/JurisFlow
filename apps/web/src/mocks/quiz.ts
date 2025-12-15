import { Quiz } from '../types/quiz'

export const quizzes: Quiz[] = [
  {
    id: 'quiz-civil-1',
    lessonId: 'civil-1',
    question: 'O que é o Direito Civil?',
    options: [
      { id: 'a', text: 'Regula relações entre particulares', correct: true },
      { id: 'b', text: 'Trata apenas de crimes', correct: false },
      { id: 'c', text: 'É exclusivo do Estado', correct: false },
    ],
  },
]
