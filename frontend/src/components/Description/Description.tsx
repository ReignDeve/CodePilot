/* eslint-disable prettier/prettier */
// Description.tsx
import React from 'react'

interface DescriptionProps {
  description: string
}

const Description: React.FC<DescriptionProps> = ({ description }) => {
  const lines: string[] = description.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    if (/^Example \d/.test(line)) {
      // Heading for Example
      elements.push(
        <h3 key={i} className="mb-2 mt-4 font-semibold ">
          {line}
        </h3>
      )
      i++
      // Collect blockquote lines until next section or blank
      const blockLines: string[] = []
      while (
        i < lines.length &&
        lines[i].trim() &&
        !/^(Example \d|Constraints:|You may assume:)/.test(lines[i].trim())
      ) {
        blockLines.push(lines[i])
        i++
      }
      elements.push(
        <blockquote
          key={`b${i}`}
          className="mb-4 border-l-4 border-gray-300 pl-4 italic"
        >
          {blockLines.map((l, idx) => (
            <p key={idx} className="whitespace-pre-wrap ">
              {l}
            </p>
          ))}
        </blockquote>
      )
    } else if (/^You may assume:/.test(line)) {
      elements.push(
        <h3 key={i} className="mb-2 mt-4 font-semibold">
          You may assume:
        </h3>
      )
      i++
      while (
        i < lines.length &&
        lines[i].trim() &&
        !/^(Example \d|Constraints:)/.test(lines[i].trim())
      ) {
        elements.push(
          <p key={i} className="ml-4 whitespace-pre-wrap">
            {lines[i].trim().replace(/^- /, '• ')}
          </p>
        )
        i++
      }
    } else if (/^Constraints:/.test(line)) {
      elements.push(
        <h3 key={i} className="mb-2 mt-4 font-semibold">
          Constraints:
        </h3>
      )
      i++
      while (i < lines.length && lines[i].trim()) {
        elements.push(
          <p key={i} className="ml-4 whitespace-pre-wrap">
            {lines[i].trim().replace(/^- /, '• ')}
          </p>
        )
        i++
      }
    } else {
      // Regular paragraph
      elements.push(
        <p key={i} className=" mb-2 whitespace-pre-wrap">
          {lines[i]}
        </p>
      )
      i++
    }
  }

  return <div className="max-h-screen min-h-full overflow-y-auto">{elements}</div>
}

export default Description
