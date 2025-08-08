import * as React from 'react'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from '@radix-ui/react-navigation-menu'
import * as Avatar from '@radix-ui/react-avatar'
import * as Popover from '@radix-ui/react-popover'
import { Link, useNavigate } from 'react-router-dom'
import { Flex, Box, Button, IconButton } from '@radix-ui/themes'
import { SunIcon, MoonIcon } from '@radix-ui/react-icons'
import { useAuth } from 'contexts/AuthContext'
import { useEffect, useState } from 'react'

interface Props {
  appearance: 'light' | 'dark'
  onToggleAppearance: () => void
}

const Navigation: React.FC<Props> = ({ appearance, onToggleAppearance }) => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [error, setError] = React.useState<string | null>(null)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (err: any) {
      setError(err.message)
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
    <header className="flex w-full items-center justify-between px-4 py-2 shadow">
      {/* Links: Logo / Home */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/" className="text-xl font-bold">
                CodePilot
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {/* Center / Spacer */}
      <div className="flex items-center gap-3 z-40">
        <IconButton
          aria-label="toggle dark / light"
          variant="ghost"
          size="3"
          radius="full"
          className="z-40"
          onClick={() =>
            typeof onToggleAppearance === 'function' && onToggleAppearance()
          }
        >
          {appearance == 'dark' ? <SunIcon /> : <MoonIcon />}
        </IconButton>

        {/* Rechts: Avatar als Popover‑Trigger */}
        <Popover.Root>
          <Popover.Trigger asChild className="z-40">
            <Avatar.Root className="relative inline-flex size-10 cursor-pointer select-none items-center justify-center overflow-hidden rounded-full bg-gray-100">
              <Avatar.Image
                className="size-full rounded-full object-cover"
                src="/src/assets/logo.svg"
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
            className="rounded-lg p-4 shadow-lg z-40"
          >
            <Flex direction="column" gap="3" className="min-w-[150px]">
              <Button onClick={handleLogout} variant="solid">
                Sign Out
              </Button>
              <Button onClick={handleLogin} className="text-sm hover:underline">
                Sign In
              </Button>
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
