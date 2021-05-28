import React, { useMemo } from 'react'
import debounce from 'lodash.debounce'

import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'
import { applyDevTools } from 'prosemirror-dev-toolkit'

import { PMEditor } from 'pm/PMEditor'

class EditorStore {

  view?: EditorView
  currentEditorState?: {[key: string]: any}
  STORAGE_KEY = 'editor-store'

  constructor() {
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem(this.STORAGE_KEY)
      if (existing && existing !== null && existing.length > 0) {
        let stored = JSON.parse(existing)
        this.currentEditorState = stored
      }
    }
  }

  setEditorView = (view: EditorView) => {
    this.view = view
    if (this.currentEditorState) {
      const state = EditorState.fromJSON(
        {
          schema: this.view.state.schema,
          plugins: this.view.state.plugins,
        },
        this.currentEditorState
      )
      this.view.updateState(state)
    }
  }

  syncCurrentEditorState = () => {
    const newState = this.view!.state.toJSON()
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newState))
  }
}

export function Editor() {
  const editorStore = useMemo(() => new EditorStore(), [])
  const debouncedSync = useMemo(() => debounce(editorStore.syncCurrentEditorState, 250), [])

  function handleEdit() {
    debouncedSync()
  }
  function handleEditorReady(view: EditorView) {
    editorStore.setEditorView(view)
    applyDevTools(view)
  }
  return (
    <PMEditor
      onEdit={handleEdit}
      onEditorReady={handleEditorReady}
    />
  )
}
