import { Track, Lesson } from '../types/education'

export const tracks: Track[] = [
  { id: 'civil', title: 'Direito Civil Básico', progress: 30 },
  { id: 'penal', title: 'Direito Penal Introdutório', progress: 0 },
  { id: 'constitucional', title: 'Direito Constitucional', progress: 65 },
]

export const lessons: Lesson[] = [
  {
    id: 'civil-1',
    trackId: 'civil',
    title: 'Introdução ao Direito Civil',
    content: 'Conteúdo da aula de Direito Civil.',
    completed: false,
  },
  {
    id: 'penal-1',
    trackId: 'penal',
    title: 'Fundamentos do Direito Penal',
    content: 'Conteúdo da aula de Direito Penal.',
    completed: false,
  },
  {
    id: 'constitucional-1',
    trackId: 'constitucional',
    title: 'Noções de Direito Constitucional',
    content: 'Conteúdo da aula de Constitucional.',
    completed: false,
  },
]
