// Popover.tsx
import React from 'react'
import { Box, Card, Inset } from '@radix-ui/themes'

export interface CourseCardProps {
  coversrc?: string
  description?: string
  onClicks?: () => void
}

/**
 * A reusable Popover component using Radix UI Popover primitives.
 */
const CourseCard: React.FC<CourseCardProps> = ({
  coversrc,
  description,
  onClicks
}) => (
  <Box maxWidth="240px" minWidth="200px" onClick={onClicks}>
    <Card size="2" className="bg-[#f5f5f5]">
      <Inset clip="padding-box" side="top" pb="current">
        <img
          src={coversrc}
          alt="Bold typography"
          style={{
            display: 'block',
            objectFit: 'cover',
            width: '100%',
            height: 100,
            backgroundColor: 'var(--gray-5)'
          }}
        />
      </Inset>
      <p>{description}</p>
    </Card>
  </Box>
)

export default CourseCard
