import { useRef } from 'react'

const requiredColumns = [
  'influencer_name',
  'type',
  'influencer_id',
  'username',
  'followers_count',
  'following_count',
  'avg_likes',
  'avg_comments',
  'total_posts',
  'account_age_days',
  'profile_complete',
  'label',
]

export default function DataUpload({ onUpload, preview, error, loading }) {
  const inputRef = useRef(null)

  const handleFile = (file) => {
    if (file) onUpload(file)
  }

  return (
    <div className="space-y-5">
      <div
        className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-center shadow-sm"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          handleFile(e.dataTransfer.files?.[0])
        }}
      >
        <p className="mb-3 text-sm text-slate-600">Drag and drop CSV here, or</p>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white" onClick={() => inputRef.current?.click()}>
          {loading ? 'Analyzing...' : 'Upload CSV'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          hidden
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h3 className="mb-2 font-semibold">Required columns</h3>
        <div className="flex flex-wrap gap-2">
          {requiredColumns.map((col) => (
            <span key={col} className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">
              {col}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">Preview shows only first 200 rows for performance.</p>
      </div>

      {preview.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-white p-4 shadow-sm">
          <table className="min-w-full text-xs">
            <thead>
              <tr>
                {Object.keys(preview[0]).map((k) => (
                  <th key={k} className="border-b p-2 text-left font-semibold">
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="border-b p-2">
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
