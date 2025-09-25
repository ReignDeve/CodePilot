import React, { useState } from 'react'

interface LectionData {
  name: string
  description: string
  code: string
}

const lections: LectionData[] = [
  {
    name: 'Variablen',
    description:
      'Variablen sind Behälter für Datenwerte. Sie werden verwendet, um Werte zu speichern und später zu referenzieren. In JavaScript deklarierst du Variablen mit let, const oder var.',
    code: `let name = "Max";
const alter = 25;
var istAktiv = true;

console.log(name, alter, istAktiv);`
  },
  {
    name: 'Funktionen',
    description:
      'Funktionen sind wiederverwendbare Codeblöcke, die eine bestimmte Aufgabe ausführen. Sie helfen dabei, Code zu organisieren und zu modularisieren.',
    code: `function begruessung(name) {
  return "Hallo, " + name + "!";
}

console.log(begruessung("Anna")); // Ausgabe: Hallo, Anna!`
  }
  // Füge hier weitere Lektionen hinzu...
]

const Lection: React.FC = () => {
  const [selectedLection, setSelectedLection] = useState<LectionData | null>(
    null
  )

  if (!selectedLection) {
    return (
      <div className="lections-container p-6 ">
        <div className="space-y-2">
          {lections.map((lection, index) => (
            <button
              key={index}
              className="w-full rounded border bg-gray-100 p-3 text-left hover:bg-gray-200"
              onClick={() => setSelectedLection(lection)}
            >
              {lection.name}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="lections-container rounded-lg bg-white p-6 shadow-md">
      <button
        className="mb-4 text-blue-600 hover:underline"
        onClick={() => setSelectedLection(null)}
      >
        ← Zurück zur Übersicht
      </button>
      <h2 className="mb-2 text-xl font-semibold text-blue-600">
        {selectedLection.name}
      </h2>
      <p className="mb-4 leading-relaxed text-gray-700">
        {selectedLection.description}
      </p>
      <div className="overflow-x-auto rounded border bg-gray-100 p-4">
        <pre className="text-sm text-gray-900">
          <code>{selectedLection.code}</code>
        </pre>
      </div>
    </div>
  )
}

export default Lection
