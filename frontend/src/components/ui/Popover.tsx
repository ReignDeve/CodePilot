// Popover.tsx
import React, { ReactNode } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

export interface PopoverProps {
  /** The element that triggers the popover */
  trigger: ReactNode
  /** Popover content */
  children: ReactNode
  /** Width of popover content (e.g., '360px') */
  width?: string
  /** Offset from trigger to content */
  sideOffset?: number
}

/**
 * A reusable Popover component using Radix UI Popover primitives.
 */
const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  width = 'auto'
}) => (
  <PopoverPrimitive.Root>
    <PopoverPrimitive.Trigger asChild>
      {/* Trigger can be any ReactNode */}
      {trigger}
    </PopoverPrimitive.Trigger>

    <PopoverPrimitive.Content
      className="mr-5 mt-3 rounded bg-[#262626] p-2"
      style={{ width }}
    >
      {children}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Root>
)

export default Popover
