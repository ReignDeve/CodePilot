// CompilerConfigContext.tsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { toConfigById } from 'services/TaskMapping'
import { getTasks, TaskDto } from 'services/TaskService'

const Ctx = createContext<{
  tasks: TaskDto[]
  configById: Map<
    string,
    { endpoint: string; expectedOutput?: string; invocations?: string[] }
  >
}>({ tasks: [], configById: new Map() })

export function CompilerConfigProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [tasks, setTasks] = useState<TaskDto[]>([])

  useEffect(() => {
    getTasks().then(setTasks).catch(console.error)
  }, [])
  const configById = useMemo(() => toConfigById(tasks), [tasks])
  console.log('CompilerConfigProvider render, tasks count:', tasks.length)
  return <Ctx.Provider value={{ tasks, configById }}>{children}</Ctx.Provider>
}

export const useCompilerConfig = () => useContext(Ctx)
