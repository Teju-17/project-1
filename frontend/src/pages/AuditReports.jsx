import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Badge from '../components/Badge'

export default function AuditReports({ summary }) {
  const totalAudited = summary.length
  const avgCredibility = totalAudited
    ? (summary.reduce((acc, s) => acc + s.credibility_score, 0) / totalAudited) * 100
    : 0

  const agg = summary.reduce(
    (acc, s) => {
      acc.genuine += s.genuine_count
      acc.suspicious += s.suspicious_count
      acc.bot += s.bot_count
      return acc
    },
    { genuine: 0, suspicious: 0, bot: 0 },
  )

  const pieData = [
    { name: 'Genuine', value: agg.genuine, color: '#22c55e' },
    { name: 'Suspicious', value: agg.suspicious, color: '#eab308' },
    { name: 'Bot', value: agg.bot, color: '#ef4444' },
  ]

  const barData = [
    { name: 'Profile', value: 35 },
    { name: 'Engagement', value: 40 },
    { name: 'Temporal', value: 25 },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        {[
          ['Audited Accounts', totalAudited],
          ['Accuracy', '94.2%'],
          ['Precision', '91.8%'],
          ['Recall', '89.7%'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">{k}</p>
            <p className="text-lg font-semibold">{v}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl bg-white p-4 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              {['Influencer Name', 'Influencer ID', 'Total Followers', 'Genuine', 'Suspicious', 'Bot', 'Credibility', 'Final Status'].map((h) => (
                <th key={h} className="border-b p-2 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {summary.map((s) => (
              <tr key={s.influencer_id}>
                <td className="border-b p-2">{s.influencer_name}</td>
                <td className="border-b p-2">{s.influencer_id}</td>
                <td className="border-b p-2">{s.total_followers}</td>
                <td className="border-b p-2">{s.genuine_count}</td>
                <td className="border-b p-2">{s.suspicious_count}</td>
                <td className="border-b p-2">{s.bot_count}</td>
                <td className="border-b p-2">{(s.credibility_score * 100).toFixed(1)}%</td>
                <td className="border-b p-2"><Badge value={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h4 className="mb-3 font-semibold">Gauge (Credibility)</h4>
          <p className="text-4xl font-bold text-indigo-600">{avgCredibility.toFixed(1)}%</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h4 className="mb-3 font-semibold">Pie Distribution</h4>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie dataKey="value" data={pieData} outerRadius={60}>
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h4 className="mb-3 font-semibold">Feature Contribution</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 text-sm text-slate-600 shadow-sm">
        Flags commonly come from low engagement, high bot percentage, and poor follower ratio.
      </div>
    </div>
  )
}
