import { get, writable } from 'svelte/store'
import { EditorState, Transaction } from 'prosemirror-state'

import { createHistoryEntry } from '../history-and-diff/createHistoryEntry'

import type { HistoryEntry, HistoryGroup } from '$typings/history'

export const stateHistory = writable(new Map<string, HistoryEntry>())
export const shownHistoryGroups = writable([] as HistoryGroup[])
export const latestEntry = writable<HistoryEntry | undefined>(undefined)

export function appendNewHistoryEntry(tr: Transaction, state: EditorState) {
  const entryMap = get(stateHistory)
  const prevGroup = get(shownHistoryGroups)[0]
  const oldEntry = entryMap.get(prevGroup?.topEntryId || '')
  const newEntry = createHistoryEntry(tr, state, oldEntry)

  stateHistory.update(val => new Map(val.set(newEntry.id, newEntry)))
  latestEntry.set(newEntry)

  const isGroup = !newEntry.contentDiff
  if (prevGroup?.isGroup && isGroup) {
    const newGroup = {
      isGroup,
      entryIds: [newEntry.id, ...prevGroup.entryIds],
      topEntryId: newEntry.id,
      expanded: prevGroup.expanded
    }
    shownHistoryGroups.update(val => [newGroup, ...val.slice(1)])
  } else {
    const newGroup = {
      isGroup,
      entryIds: [newEntry.id],
      topEntryId: newEntry.id,
      expanded: false
    }
    shownHistoryGroups.update(val => [newGroup, ...val])
  }
}

export function resetHistory() {
  stateHistory.set(new Map())
  shownHistoryGroups.set([])
}