import { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import { analyzeCsv } from './lib/api'
import AlgorithmOverview from './pages/AlgorithmOverview'
import AuditReports from './pages/AuditReports'
import DashboardOverview from './pages/DashboardOverview'
import DataUpload from './pages/DataUpload'
import DetectionResults from './pages/DetectionResults'
import Explanation from './pages/Explanation'

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard Overview')
  const [preview, setPreview] = useState([])
  const [summary, setSummary] = useState([])
  const [details, setDetails] = useState([])
  const [weights, setWeights] = useState({})
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpload = async (file) => {
    setError('')
    setLoading(true)
    try {
      const res = await analyzeCsv(file)
      setPreview(res.preview || [])
      setSummary(res.summary || [])
      setDetails(res.follower_details || [])
      setWeights(res.weights || {})
      setActiveTab('Detection Results')
    } catch (e) {
      setError(e.response?.data?.detail || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard Overview':
        return <DashboardOverview />
      case 'Data Upload':
        return <DataUpload onUpload={handleUpload} preview={preview} error={error} loading={loading} />
      case 'Detection Results':
        return <DetectionResults details={details} onSelect={(row) => { setSelected(row); setActiveTab('Explanation & Justification') }} />
      case 'Explanation & Justification':
        return <Explanation selected={selected} details={details} />
      case 'Audit & Reports':
        return <AuditReports summary={summary} />
      case 'Algorithm Overview':
        return <AlgorithmOverview weights={weights} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="h-[calc(100vh-72px)] flex-1 overflow-auto p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
