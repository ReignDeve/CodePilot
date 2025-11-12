/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from '@radix-ui/react-navigation-menu'
import * as Avatar from '@radix-ui/react-avatar'
import * as Popover from '@radix-ui/react-popover'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Flex, Button, Badge, Tooltip } from '@radix-ui/themes'
import { useTaskExecution } from 'contexts/TaskExecutionContext'
import { runTaskExecution } from 'services/RunService'
import { useAuth } from 'contexts/AuthContext'
import { Icon } from '@radix-ui/themes/components/callout'
import { PinTopIcon, PlayIcon } from '@radix-ui/react-icons'
import { useMemo, useState } from 'react'
import { toConfigById } from 'services/TaskMapping'
import { TaskDto } from 'services/TaskService'
import { useCompilerConfig } from 'contexts/CompilerConfigContext'

interface Props {
  appearance: 'light' | 'dark'
  onToggleAppearance: () => void
}

const Navigation: React.FC<Props> = ({ appearance, onToggleAppearance }) => {
  const navigate = useNavigate()
  const { userName, token, logout } = useAuth()
  const { taskId, code, language, updateExecutionData } = useTaskExecution()
  const [isExecuting, setIsExecuting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const location = useLocation() // aktueller Pfad
  const [submitDisabled, setSubmitDisabled] = React.useState(true)
  const [tasks, setTasks] = useState<TaskDto[]>([])
  const loading = tasks.length === 0

  const isTaskDetail = /^\/task?\/[^/]+$/.test(location.pathname)
  const { configById } = useCompilerConfig()
  const cfg = configById.get(taskId ?? '') ?? {
    endpoint: 'http://localhost:8000/compile'
  }

  function clearReactResizablePanels() {
    if (typeof window === 'undefined') return
    const keys = ['taskdetail-mosaic']
    keys.forEach((k) => window.localStorage.removeItem(k))
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleExecute = async () => {
    if (!taskId || !code) {
      setError('Task oder Code fehlt zum Ausführen.')
      return
    }

    try {
      setError(null)
      setIsExecuting(true)

      console.log('[exec] taskId:', taskId)
      console.log('[exec] map keys:', Array.from(configById.keys()))
      console.table(tasks.map((t) => ({ id: t.id, externalId: t.externalId })))
      // Debug: zeigen, was wir haben
      console.log('[exec] taskId:', taskId)
      console.log('[exec] map keys:', Array.from(configById.keys()))

      const cfg = configById.get(taskId)
      if (!cfg) {
        // KEIN Fallback – lieber fail fast, damit du es merkst
        throw new Error(
          `Keine Compiler-Config für taskId=${taskId}. Prüfe toConfigById().`
        )
      }

      console.log('[exec] endpoint chosen:', cfg.endpoint)

      const result = await runTaskExecution({
        taskId,
        code,
        language,
        invocations: cfg.invocations,
        expectedOutput: cfg.expectedOutput,
        endpoint: cfg.endpoint
      })

      if (result?.isCorrect) {
        setSubmitDisabled(false)
        updateExecutionData({ isCompiled: true })
      } else {
        updateExecutionData({ isCompiled: false })
      }
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? 'Fehler beim Ausführen')
    } finally {
      setIsExecuting(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      navigate('/login')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <header className="flex h-14 w-full items-center justify-between px-4 py-2 shadow">
      {/* Links: Logo / Home */}
      <NavigationMenu>
        <NavigationMenuList className="flex items-center gap-4">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <img src="/Logo.png" alt="Logo" className="size-16" />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                to="/"
                className="text-lg"
                onClick={() => {
                  clearReactResizablePanels()
                }}
              >
                Dashboard
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <p className="text-lg">Lektionen</p>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="items-center justify-center">
        {isTaskDetail && (
          <div className="flex gap-3">
            <Tooltip content="Ausführen">
              <Button
                color="gray"
                variant="soft"
                size="3"
                onClick={handleExecute}
                disabled={isExecuting}
              >
                <PlayIcon color="black" />
              </Button>
            </Tooltip>
            <Tooltip content="Abgeben" className="bg-white">
              <Button
                color="gray"
                variant="soft"
                size="3"
                disabled={submitDisabled}
              >
                <PinTopIcon className="text-green-500" />
                <p className="text-green-500">Abgeben</p>
              </Button>
            </Tooltip>
          </div>
        )}
      </div>
      {/* Center / Spacer */}
      <div className="z-40 flex items-center gap-3">
        {/* Rechts: Avatar als Popover‑Trigger */}
        <div>
          {userName?.trim() && (
            <Badge
              color="gray"
              size="3"
              className="inline-flex items-center gap-2 rounded-3xl bg-gray-100 p-5 text-lg font-medium"
            >
              Eingeloggt als{' '}
              <span className="font-bold">{userName.trim()}</span>
            </Badge>
          )}
        </div>
        <Popover.Root>
          <Popover.Trigger asChild className="z-40">
            <Avatar.Root className="relative inline-flex size-10 cursor-pointer select-none items-center justify-center overflow-hidden rounded-full bg-[#f0f0f3]">
              <Avatar.Image
                className="size-full rounded-full object-cover"
                src="/Logo.png"
                alt="User avatar"
              />
              <Avatar.Fallback
                className="leading-10 text-gray-500"
                delayMs={600}
              >
                CP
              </Avatar.Fallback>
            </Avatar.Root>
          </Popover.Trigger>

          <Popover.Content
            sideOffset={8}
            align="end"
            className="z-40 rounded-lg bg-white p-4 shadow-lg"
          >
            <Flex direction="column" gap="3" className="min-w-[150px]">
              {token ? (
                <Button onClick={handleLogout} variant="solid">
                  Abmelden
                </Button>
              ) : (
                <Button
                  onClick={handleLogin}
                  className="text-sm hover:underline"
                >
                  Anmelden
                </Button>
              )}
              {error && (
                <span className="mt-2 text-xs text-red-500">{error}</span>
              )}
            </Flex>
            <Popover.Arrow className="fill-[#262626]" />
          </Popover.Content>
        </Popover.Root>
      </div>
    </header>
  )
}

export default Navigation
