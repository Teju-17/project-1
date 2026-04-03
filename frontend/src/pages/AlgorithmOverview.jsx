export default function AlgorithmOverview({ weights }) {
  const cards = [
    ['Feature engineering', 'ratio = followers/(following+1), engagement_ratio = (likes+comments)/(followers+1), activity_rate = total_posts/(age+1)'],
    ['Normalization', 'x_norm = (x - xmin) / (xmax - xmin + epsilon)'],
    ['Risk scores', 'ProfileScore = avg(1-ratio_norm, 1-age_norm, 1-profile_complete), EngagementScore = 1-engagement_norm, TemporalScore = activity_norm'],
    ['Entropy weighting', 'p_ij = x_ij/sum(x_ij), E_j=-k*sum(p_ij ln p_ij), D_j=1-E_j, w_j=D_j/sum(D_j)'],
    ['Final score', 'RiskScore = w_p*ProfileScore + w_e*EngagementScore + w_t*TemporalScore'],
    ['Classification + credibility', 'Risk<0.4 Genuine, 0.4-0.7 Suspicious, >0.7 Bot. Credibility = (Ng + 0.5*Ns)/N'],
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map(([title, formula]) => (
          <div key={title} className="rounded-xl bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-semibold">{title}</h3>
            <p className="text-sm text-slate-600">{formula}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h3 className="mb-2 font-semibold">Current entropy weights</h3>
        <p className="text-sm text-slate-600">
          w_p: {weights.w_p ?? '-'} | w_e: {weights.w_e ?? '-'} | w_t: {weights.w_t ?? '-'}
        </p>
      </div>
    </div>
  )
}
