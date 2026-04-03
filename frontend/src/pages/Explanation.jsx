import Badge from '../components/Badge'

export default function Explanation({ selected, details }) {
  if (!selected) {
    return <div className="rounded-xl bg-white p-6 shadow-sm">Pick a follower from Detection Results to inspect explanation.</div>
  }

  const riskPct = (selected.risk_score * 100).toFixed(1)
  const signals = [
    { label: 'Follower Quality', value: selected.ProfileScore },
    { label: 'Engagement Risk', value: selected.EngagementScore },
    { label: 'Temporal Activity', value: selected.TemporalScore },
    { label: 'Profile Pattern', value: selected.ProfileScore },
  ]

  const sample = details.filter((d) => d.influencer_id === selected.influencer_id).slice(0, 20)

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h3 className="mb-2 text-lg font-semibold">Account Verdict</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <p className="text-xs text-slate-500">Username</p>
            <p className="font-semibold">{selected.username}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Risk</p>
            <p className="font-semibold">{riskPct}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Category</p>
            <Badge value={selected.category} />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h3 className="mb-2 font-semibold">Why flagged</h3>
        <div className="space-y-3">
          {signals.map((s) => (
            <div key={s.label}>
              <div className="mb-1 flex justify-between text-xs">
                <span>{s.label}</span>
                <span>{(s.value * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded bg-slate-100">
                <div className="h-2 rounded bg-indigo-500" style={{ width: `${Math.min(100, s.value * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white p-4 shadow-sm">
        <h4 className="mb-2 font-semibold">Follower-level explanation sample</h4>
        <table className="min-w-full text-xs">
          <thead>
            <tr>
              <th className="border-b p-2 text-left">Username</th>
              <th className="border-b p-2 text-left">Risk</th>
              <th className="border-b p-2 text-left">Category</th>
            </tr>
          </thead>
          <tbody>
            {sample.map((r, idx) => (
              <tr key={idx}>
                <td className="border-b p-2">{r.username}</td>
                <td className="border-b p-2">{Number(r.risk_score).toFixed(3)}</td>
                <td className="border-b p-2">
                  <Badge value={r.category} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
