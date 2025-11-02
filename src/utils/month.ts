export function getMonthFromQuery() {
  const p = new URLSearchParams(window.location.search)
  const m = p.get('month') // YYYY-MM
  if (m && /^\d{4}-\d{2}$/.test(m)) return m
  const now = new Date()
  const y = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  return `${y}-${month}`
}

export function addMonths(ym: string, delta: number) {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + delta, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}
