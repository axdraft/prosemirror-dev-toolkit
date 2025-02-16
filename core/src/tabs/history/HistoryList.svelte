<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { HistoryEntry } from '$typings/history'

  export let listItems: {
      isGroup: boolean
      topEntry: HistoryEntry | undefined
      entries: (HistoryEntry | undefined)[]
      expanded: boolean
    }[] = [],
    selectedId: string

  const dispatchClick = createEventDispatcher<{
    'click-item': { id: string | undefined; groupIdx: number; wasTopNode: boolean }
  }>()
  const dispatchDblClick = createEventDispatcher<{ 'dblclick-item': { id?: string } }>()
</script>

<ul>
  {#each listItems as group, groupIdx}
    <li class:selected={!group.expanded && selectedId === group?.topEntry?.id}>
      <button
        class:is-group={group.isGroup}
        on:click={() =>
          dispatchClick('click-item', { id: group?.topEntry?.id, groupIdx, wasTopNode: true })}
        on:dblclick={() => dispatchDblClick('dblclick-item', { id: group?.topEntry?.id })}
      >
        <span>
          {group?.topEntry?.timeStr}
          {#if group.isGroup}
            [{group.entries.length}]
          {/if}
        </span>
        {#if group.isGroup && group.entries.length > 1}
          <span class="caret-icon" class:expanded={group.expanded} />
        {/if}
      </button>
    </li>
    {#if group.isGroup && group.expanded}
      {#each group.entries as subEntry}
        <li class:selected={selectedId === subEntry?.id}>
          <button
            class="p-left"
            on:click={() =>
              dispatchClick('click-item', { id: subEntry?.id, groupIdx, wasTopNode: false })}
          >
            {subEntry?.timeStr}
          </button>
        </li>
      {/each}
    {/if}
  {/each}
</ul>

<style lang="scss">
  ul {
    color: $color-white;
    list-style: none;
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
  li {
    transition: background 0.1s;
    &:hover {
      background: rgba($color-red-light, 0.4);
      color: $color-white;
    }
    &.selected {
      background: rgba($color-red-light, 0.4);
    }
  }
  li + li {
    border-top: 1px solid $color-purple;
  }
  button {
    background: transparent;
    border: 0;
    color: $color-gray-light;
    cursor: pointer;
    display: flex;
    font-family: monospace;
    font-size: var(--font-small);
    justify-content: space-between;
    padding: 6px 18px;
    text-transform: uppercase;
    width: 100%;

    &.p-left {
      margin-left: 1em;
    }
  }
  .caret-icon::before {
    content: '▶';
  }
  .caret-icon.expanded::before {
    content: '▼';
  }
</style>
