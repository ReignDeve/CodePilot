/* eslint-disable tailwindcss/no-custom-classname */
import React, { useRef, useState } from 'react'
import { TaskDto } from 'services/TaskService'
import {
  CheckIcon,
  MagnifyingGlassIcon,
  MixerVerticalIcon
} from '@radix-ui/react-icons'
import { Button, DropdownMenu } from '@radix-ui/themes'

interface TaskFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  statusFilter: TaskDto['status'] | 'All'
  setStatusFilter: (status: TaskDto['status'] | 'All') => void
  difficultyFilter: TaskDto['difficulty'] | 'All'
  setDifficultyFilter: (difficulty: TaskDto['difficulty'] | 'All') => void
  filteredTasksCount: number
  totalTasksCount: number
}

type Status = 'All' | 'NotStarted' | 'InProgress' | 'Completed'
type Difficulty = 'All' | 'Easy' | 'Medium' | 'Hard'

const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  difficultyFilter,
  setDifficultyFilter
}) => {
  const [open, setOpen] = useState(false)
  const [draftStatus, setDraftStatus] = useState<Status>(statusFilter)
  const [draftDifficulty, setDraftDifficulty] =
    useState<Difficulty>(difficultyFilter)
  const ref = useRef<HTMLDivElement>(null)

  // Badge-Zähler
  const activeCount =
    (statusFilter !== 'All' ? 1 : 0) + (difficultyFilter !== 'All' ? 1 : 0)
  const apply = () => {
    setStatusFilter(draftStatus)
    setDifficultyFilter(draftDifficulty)
    setOpen(false)
  }

  const clear = () => {
    setDraftStatus('All')
    setDraftDifficulty('All')
  }

  const statusLabel = (v: Status | 'All') =>
    v === 'All'
      ? 'Alle'
      : v === 'NotStarted'
        ? 'Not Started'
        : v === 'InProgress'
          ? 'In Progress'
          : 'Completed'

  const difficultyLabel = (v: Difficulty | 'All') =>
    v === 'All'
      ? 'Alle'
      : v === 'Easy'
        ? 'Easy'
        : v === 'Medium'
          ? 'Medium'
          : 'Hard'

  return (
    <div className="bg-card border-border rounded-lg ">
      <div className="flex flex-col items-center gap-4 lg:flex-row">
        {/* Search */}
        <div className="flex max-w-[40%] flex-1 items-center justify-center gap-1 rounded-full bg-[#f5f5f5]">
          <form
            className="border-1 relative w-full rounded-full border "
            onSubmit={async (e) => {
              e.preventDefault()
              // await safeAsk((id, c) => askPilot(id, c, input));
            }}
          >
            <MagnifyingGlassIcon className="absolute left-2 top-1/2 inline-flex size-4 -translate-y-1/2 items-center justify-center disabled:opacity-50" />
            <input
              id="search"
              type="text"
              placeholder="Nach Aufgaben suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" text-foreground placeholder:text-muted-foreground w-full bg-transparent px-8 py-2 focus:outline-none"
            />
          </form>
        </div>

        {/* Status Filter */}
        <div className="relative inline-block" ref={ref}>
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="border-border hover:bg-accent/30 relative inline-flex size-10 items-center gap-2 rounded-full border bg-[#f5f5f5] px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <MixerVerticalIcon />

            {activeCount > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </button>

          {open && (
            <div
              role="dialog"
              aria-label="Filter"
              className="border-border absolute right-0 z-50 mt-2 w-72 rounded-xl border bg-white p-3 shadow-xl"
            >
              <div className="space-y-3">
                {/* Status */}
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-medium">
                    Status
                  </label>

                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <Button
                        variant="soft"
                        size="2"
                        className="w-full justify-between"
                      >
                        <span className="truncate">
                          {statusLabel(draftStatus)}
                        </span>
                        <DropdownMenu.TriggerIcon />
                      </Button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Content align="end" sideOffset={6}>
                      {[
                        { value: 'All', label: 'All' },
                        { value: 'NotStarted', label: 'Not Started' },
                        { value: 'InProgress', label: 'In Progress' },
                        { value: 'Completed', label: 'Completed' }
                      ].map((o) => (
                        <DropdownMenu.Item
                          key={o.value}
                          onSelect={() => {
                            setDraftStatus(o.value as Status) // <- State setzen
                          }}
                          className="flex items-center justify-between gap-3"
                        >
                          <span>{o.label}</span>
                          {draftStatus === o.value && <CheckIcon />}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-medium">
                    Difficulty
                  </label>

                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <Button
                        variant="soft"
                        size="2"
                        className="w-full justify-between"
                      >
                        <span className="truncate">
                          {difficultyLabel(draftDifficulty)}
                        </span>
                        <DropdownMenu.TriggerIcon />
                      </Button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Content align="end" sideOffset={6}>
                      {[
                        { value: 'All', label: 'Alle' },
                        { value: 'Easy', label: 'Easy' },
                        { value: 'Medium', label: 'Medium' },
                        { value: 'Hard', label: 'Hard' }
                      ].map((o) => (
                        <DropdownMenu.Item
                          key={o.value}
                          onSelect={() =>
                            setDraftDifficulty(o.value as Difficulty)
                          }
                          className="flex items-center justify-between gap-3"
                        >
                          <span>{o.label}</span>
                          {draftDifficulty === o.value && <CheckIcon />}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={clear}
                    className="text-muted-foreground hover:bg-accent/40 rounded-md px-2 py-1 text-xs"
                  >
                    Zurücksetzen
                  </button>
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={apply}
                      className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Anwenden
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Counter
      <div className="border-border mt-4 border-t pt-4">
        <p className="text-muted-foreground text-sm">
          {filteredTasksCount} von {totalTasksCount} Aufgaben werden
          angezeigt
          {searchTerm && ` • Suche: "${searchTerm}"`}
          {statusFilter !== 'All' &&
            ` • Status: ${statusFilter.replace(/([A-Z])/g, ' $1').trim()}`}
          {difficultyFilter !== 'All' &&
            ` • Schwierigkeit: ${difficultyFilter}`}
        </p>
      </div> */}
    </div>
  )
}

export default TaskFilters
