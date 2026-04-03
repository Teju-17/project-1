export default function Badge({ value }) {
  const styles = {
    Genuine: 'bg-green-100 text-green-700',
    Suspicious: 'bg-yellow-100 text-yellow-700',
    Bot: 'bg-red-100 text-red-700',
    'Genuine influencer': 'bg-green-100 text-green-700',
    'Fake influencer': 'bg-red-100 text-red-700',
  }

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${styles[value] || 'bg-slate-100 text-slate-700'}`}>
      {value}
    </span>
  )
}
