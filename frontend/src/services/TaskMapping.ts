import { TaskDto } from './TaskService'

export function toConfigById(tasks: TaskDto[]) {
  console.table(tasks.map((t) => ({ id: t.id, externalId: t.externalId })))

  const map = new Map<
    string,
    { endpoint: string; expectedOutput?: string; invocations?: string[] }
  >()
  for (const t of tasks) {
    switch (t.externalId) {
      case 'for-loop-arrays':
        map.set(t.id, {
          endpoint: 'http://localhost:8000/compile',
          expectedOutput: `2 3 4
1 0 -1
6`
        })
        break
      case 'filter-array-elements':
        map.set(t.id, {
          endpoint: 'http://localhost:8001/compile',
          expectedOutput: `12 20 8
12 20 33
7 12 20 8`
        })
        break
      case 'reduce-array-to-single-value':
        map.set(t.id, {
          endpoint: 'http://localhost:8002/compile',
          expectedOutput: `30
4
0`,
          invocations: ['new[]{5,10,15}', 'new[]{1,1,1,1}', 'new[]{-5,5}']
        })
        break
      default:
        // Falls eine unbekannte ExternalId reinkommt: explizit NICHT füllen, damit du einen Fehler siehst
        break
    }
  }
  return map
}
