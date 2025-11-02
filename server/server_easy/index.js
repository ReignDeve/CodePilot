// index.js (Server #3 für "For Loop with Arrays")
import express, { json } from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()
const PORT = 8000

app.use(cors())
app.use(json())

app.post('/compile', async (req, res) => {
  const {
    code = '',
    language = '',
    input = '',
    entryName = '' // optional; wird sonst automatisch erkannt
  } = req.body ?? {}

  console.log('compile payload:', { language, hasCode: !!code })

  // Sprache normalisieren/mappen
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

  // Methodennamen erkennen (z. B. "IncrementArray")
  const name =
    entryName || code.match(/static\s+[\w<>[\],\s]+\s+([A-Za-z_]\w*)\s*\(/)?.[1]
  if (!name) {
    return res
      .status(400)
      .json({ error: 'Could not detect method name. Provide "entryName".' })
  }

  // Feste Testaufrufe für diese Aufgabe:
  const testCalls = `
var r1 = ${name}(new[]{1, 2, 3});
Console.WriteLine(string.Join(" ", r1));

var r2 = ${name}(new[]{0, -1, -2});
Console.WriteLine(string.Join(" ", r2));

var r3 = ${name}(new[]{5});
Console.WriteLine(string.Join(" ", r3));
`.trim()

  const fullSource = `using System;
using System.Linq;

public class Program {
  ${code}

  public static void Main() {
    ${testCalls}
  }
}
`

  const data = {
    language: languageMap[resolved].language,
    version: languageMap[resolved].version,
    files: [{ name: 'main', content: fullSource }],
    stdin: input
  }

  try {
    const { data: result } = await axios.post(
      'https://emkc.org/api/v2/piston/execute',
      data,
      { headers: { 'Content-Type': 'application/json' } }
    )
    // gibt { stdout, stderr, code, signal } in result.run zurück
    return res.json(result.run ?? result)
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
