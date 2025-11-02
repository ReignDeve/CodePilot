//index.js

import express, { json } from 'express'
import cors from 'cors'
import Axios from 'axios'
const app = express()
const PORT = 8002

app.use(cors())
app.use(json())

// index.js (Ausschnitt): nur C#-Pfad gezeigt
app.post('/compile', async (req, res) => {
  const {
    code = '',
    language = '',
    input = '',
    entryName = '',
    invocations = []
  } = req.body ?? {}

  // 1) Eingabe loggen
  console.log('compile payload:', { language, hasCode: !!code })

  // 2) Normalisieren + Aliase
  const langKey = String(language).trim().toLowerCase()
  const alias = {
    csharp: 'csharp',
    'c#': 'csharp',
    cs: 'csharp',
    'csharp.net': 'csharp.net'
  }
  const resolved = alias[langKey]

  const languageMap = {
    csharp: { language: 'csharp', version: '*' },
    'csharp.net': { language: 'csharp.net', version: '*' }
  }

  if (!resolved || !languageMap[resolved]) {
    return res.status(400).json({
      error: 'Unsupported language',
      received: language,
      supported: Object.keys(languageMap),
      aliases: Object.keys(alias)
    })
  }

  if (!code.trim()) {
    return res
      .status(400)
      .json({ error: 'Missing snippet (your static method)' })
  }

  // --- der Rest wie zuvor: Wrapper bauen, Piston callen ---
  const name =
    entryName || code.match(/static\s+[\w<>[\],\s]+\s+([A-Za-z_]\w*)\s*\(/)?.[1]
  if (!name)
    return res
      .status(400)
      .json({ error: 'Could not detect method name. Provide "entryName".' })

  const invocationsCode =
    Array.isArray(invocations) && invocations.length
      ? `var tests = new[]{ ${invocations.join(', ')} };
         foreach (var t in tests) Console.WriteLine(${name}(t));`
      : `// Console.WriteLine(${name}(/* args */));`

  const fullSource = `using System;
using System.Linq;

class Program {
  ${code}

  static void Main() {
    ${invocationsCode}
  }
}
`

  const data = {
    language: languageMap[resolved].language, // <- jetzt sicher 'csharp' oder 'csharp.net'
    version: languageMap[resolved].version, // '*' nimmt neueste Runtime
    files: [{ name: 'main', content: fullSource }],
    stdin: input
  }

  try {
    const { data: result } = await Axios.post(
      'https://emkc.org/api/v2/piston/execute',
      data,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
    console.log('data:', data)
    console.log('result:', result)
    return res.json(result.output ?? result)
  } catch (err) {
    return res.status(err.response?.status ?? 500).json({
      error: 'Execution failed',
      detail: err.response?.data ?? err.message
    })
  }
})

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
