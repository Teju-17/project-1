import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function analyzeCsv(file) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await axios.post(`${API_BASE_URL}/analyze`, form)
  return data
}
