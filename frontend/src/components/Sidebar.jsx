const tabs = [
  'Dashboard Overview',
  'Data Upload',
  'Detection Results',
  'Explanation & Justification',
  'Audit & Reports',
  'Algorithm Overview',
]

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="h-[calc(100vh-72px)] w-72 border-r border-slate-200 bg-white p-4">
      <nav className="space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
              activeTab === tab ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
    </aside>
  )
}
