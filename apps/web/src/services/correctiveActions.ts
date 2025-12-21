import type { CorrectiveAction } from '../models/CorrectiveAction'

let actions: CorrectiveAction[] = []

export function listCorrectiveActions() {
  return actions
}

export function createCorrectiveAction(
  action: CorrectiveAction
) {
  actions.push(action)
}

export function resolveCorrectiveAction(id: string) {
  actions = actions.map(a =>
    a.id === id ? { ...a, status: 'DONE' } : a
  )
}
