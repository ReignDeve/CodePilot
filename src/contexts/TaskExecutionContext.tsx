import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState
} from 'react'

interface TaskExecutionState {
  taskId: string | null
  code: string | null
  language: string
  isCompiled: boolean
}

interface TaskExecutionContextValue extends TaskExecutionState {
  updateExecutionData: (data: Partial<TaskExecutionState>) => void
  clearExecutionData: () => void
}

const DEFAULT_STATE: TaskExecutionState = {
  taskId: null,
  code: null,
  language: 'c#',
  isCompiled: false
}

const TaskExecutionContext = createContext<
  TaskExecutionContextValue | undefined
>(undefined)

export function TaskExecutionProvider({ children }: { children: ReactNode }) {
  const [executionState, setExecutionState] =
    useState<TaskExecutionState>(DEFAULT_STATE)

  const updateExecutionData = useCallback(
    (data: Partial<TaskExecutionState>) => {
      setExecutionState((prev) => ({ ...prev, ...data }))
    },
    []
  )

  const clearExecutionData = useCallback(() => {
    setExecutionState(DEFAULT_STATE)
  }, [])

  return (
    <TaskExecutionContext.Provider
      value={{
        ...executionState,
        updateExecutionData,
        clearExecutionData
      }}
    >
      {children}
    </TaskExecutionContext.Provider>
  )
}

export function useTaskExecution(): TaskExecutionContextValue {
  const context = useContext(TaskExecutionContext)
  if (!context)
    throw new Error(
      'useTaskExecution must be used within TaskExecutionProvider'
    )
  return context
}
