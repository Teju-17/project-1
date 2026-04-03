import { useMemo, useState } from 'react'
import Badge from '../components/Badge'

export default function DetectionResults({ details, onSelect }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [page, setPage] = useState(1)
  const pageSize = 12

  const filtered = useMemo(() => {
    return details.filter((d) => {
      const q = d.username?.toLowerCase().includes(query.toLowerCase())
      const f = filter === 'All' ? true : d.category === filter
      return q && f
    })
  }, [details, query, filter])

  const rows = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700">Model: Entropy-Weighted Heuristic Scoring</div>
      <div className="grid gap-3 md:grid-cols-2">
        <input
          className="rounded-lg border border-slate-200 p-2"
          placeholder="Search username"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="rounded-lg border border-slate-200 p-2" value={filter} onChange={(e) => setFilter(e.target.value)}>
          {['All', 'Genuine', 'Suspicious', 'Bot'].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white p-4 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="border-b p-2 text-left">Username</th>
              <th className="border-b p-2 text-left">Risk Score</th>
              <th className="border-b p-2 text-left">Category</th>
              <th className="border-b p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={`${r.username}-${idx}`}>
                <td className="border-b p-2">{r.username}</td>
                <td className="border-b p-2">{Number(r.risk_score).toFixed(3)}</td>
                <td className="border-b p-2">
                  <Badge value={r.category} />
                </td>
                <td className="border-b p-2">
                  <button className="rounded border border-indigo-200 px-2 py-1 text-indigo-600" onClick={() => onSelect(r)}>
                    View Explanation
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 flex justify-end gap-2">
          <button className="rounded border px-2 py-1" onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Prev
          </button>
          <button className="rounded border px-2 py-1" onClick={() => setPage((p) => (p * pageSize < filtered.length ? p + 1 : p))}>
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
