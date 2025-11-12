// Kanonische Labels
export const LANGUAGE_LABEL = {
  js: 'JavaScript',
  ts: 'TypeScript',
  py: 'Python',
  java: 'Java',
  charp: 'C#',
  cpp: 'C++',
  c: 'C',
  go: 'Go',
  rust: 'Rust',
  php: 'PHP',
  ruby: 'Ruby',
  swift: 'Swift',
  kotlin: 'Kotlin',
  dart: 'Dart',
  scala: 'Scala',
  r: 'R',
  matlab: 'MATLAB',
  sql: 'SQL',
  html: 'HTML',
  css: 'CSS',
  bash: 'Bash',
  powershell: 'PowerShell',
  objc: 'Objective-C',
  haskell: 'Haskell',
  elixir: 'Elixir',
  erlang: 'Erlang',
  lua: 'Lua',
  perl: 'Perl'
} as const

type CanonicalKey = keyof typeof LANGUAGE_LABEL

// Synonyme/Aliase -> Kanonischer Key
export const LANGUAGE_ALIASES: Record<string, CanonicalKey> = {
  javascript: 'js',
  node: 'js',
  nodejs: 'js',
  js: 'js',
  typescript: 'ts',
  ts: 'ts',
  python: 'py',
  py: 'py',
  java: 'java',
  'c#': 'charp',
  csharp: 'charp',
  'c-sharp': 'charp',
  charp: 'charp',
  'c++': 'cpp',
  cpp: 'cpp',
  c: 'c',
  golang: 'go',
  go: 'go',
  rust: 'rust',
  php: 'php',
  ruby: 'ruby',
  swift: 'swift',
  kotlin: 'kotlin',
  dart: 'dart',
  scala: 'scala',
  r: 'r',
  matlab: 'matlab',
  sql: 'sql',
  html: 'html',
  css: 'css',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  powershell: 'powershell',
  ps: 'powershell',
  'objective-c': 'objc',
  objectivec: 'objc',
  objc: 'objc',
  haskell: 'haskell',
  elixir: 'elixir',
  erlang: 'erlang',
  lua: 'lua',
  perl: 'perl'
}

// Normalisierung für Eingaben
function normalize(raw: unknown): string {
  if (typeof raw !== 'string') return ''
  const k = raw.trim().toLowerCase()
  // Sonderfälle behalten
  if (k === 'c++' || k === 'c#' || k === 'objective-c') return k
  // Sonst Sonderzeichen entfernen
  return k.replace(/[.\s_-]/g, '')
}

// Exportierte Helper-Funktion
export function labelFromKey(raw: unknown): string {
  const n = normalize(raw)
  if (!n) return '-'
  const canonical = LANGUAGE_ALIASES[n] as CanonicalKey | undefined
  if (canonical) return LANGUAGE_LABEL[canonical]
  // Wenn bereits kanonischer Key übergeben wurde:
  if (n in LANGUAGE_LABEL) return LANGUAGE_LABEL[n as CanonicalKey]
  // Fallback: zeige Original
  return typeof raw === 'string' ? raw : '-'
}
