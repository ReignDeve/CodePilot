// Description.tsx
import React from 'react';

interface DescriptionProps {
  description: string;
}

const Description: React.FC<DescriptionProps> = ({ description }) => {
  const lines: string[] = description.split('\n');
  const elements: React.ReactNode[] = [];
  let buffer: string[] = [];
  let currentHeading: string | null = null;

  const pushBuffer = () => {
    if (!currentHeading && buffer.length) {
      elements.push(
        <p key={elements.length} className="mb-2 text-white whitespace-pre-wrap">
          {buffer.join('\n')}
        </p>
      );
    } else if (currentHeading) {
      elements.push(
        <div key={elements.length} className="mb-4">
          <h3 className="font-semibold mt-2 mb-1">{currentHeading}</h3>
          {buffer.map((line, idx) => (
            <p key={idx} className="text-white whitespace-pre-wrap">
              {line}
            </p>
          ))}
        </div>
      );
    }
    buffer = [];
  };

  lines.forEach((line: string) => {
    const trimmed = line.trim();
    if (/^(You may assume|Example \d|Constraints):/.test(trimmed)) {
      if (buffer.length) {
        pushBuffer();
      }
      currentHeading = trimmed.replace(/:$/, '');
    } else {
      buffer.push(line);
    }
  });
  if (buffer.length) pushBuffer();

  return <div>{elements}</div>;
};

export default Description;
