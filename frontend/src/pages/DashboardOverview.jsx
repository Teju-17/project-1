export default function DashboardOverview() {
  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold">Project Overview</h2>
        <p className="text-sm text-slate-600">
          Upload influencer-follower CSV data, apply entropy-weighted heuristic scoring, and generate credibility verdicts.
        </p>
      </div>
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-md font-semibold">Workflow</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {['Upload CSV', 'Heuristic Scoring', 'Verdict + Credibility'].map((step, i) => (
            <div key={step} className="rounded-lg border border-slate-200 p-4 text-center">
              <div className="mb-1 text-xs text-slate-400">Step {i + 1}</div>
              <div className="font-medium">{step}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
