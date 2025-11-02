
import { useEffect, useState } from 'react'
import { MaintenanceItemsSchema, type MaintenanceItem } from '@/types'
import { addMonths } from '@/utils/month'

export function useMaintenanceData(month: string, tab: 'upcoming' | 'past') {
  const [data, setData] = useState<MaintenanceItem[]>([])
  const [source, setSource] = useState<'json' | 'fallback'>('fallback')
  const [loadedMonths, setLoadedMonths] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setError(null)
        const monthsToLoad = tab === 'upcoming' ? [month, addMonths(month, 1)] : [addMonths(month, -1), month]
        const fetchOne = async (mm: string) => {
          const res = await fetch(`/maintenance/${mm}.json?_=${Date.now()}`)
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const json = await res.json()
          const parsed = MaintenanceItemsSchema.safeParse(json)
          if (!parsed.success) throw new Error('JSONスキーマ不正')
          return parsed.data as MaintenanceItem[]
        }
        const results = await Promise.allSettled(monthsToLoad.map(fetchOne))
        let merged: MaintenanceItem[] = []
        const ok: string[] = []
        const errs: string[] = []
        results.forEach((r, i) => {
          const mm = monthsToLoad[i]
          if (r.status === 'fulfilled') {
            ok.push(mm)
            merged = merged.concat(r.value)
          } else {
            errs.push(`${mm}: ${(r as any).reason?.message || r}`)
          }
        })
        if (process.env.NODE_ENV === 'production') {
          merged = merged.filter((it) => it.published !== false)
        }
        const uniq = new Map<string, MaintenanceItem>()
        merged.forEach((it) => uniq.set(it.id, it))
        const out = Array.from(uniq.values()).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
        if (!cancelled) {
          setData(out)
          setLoadedMonths(ok)
          setSource('json')
          setError(errs.length ? errs.join(' | ') : null)
        }
      } catch (e: any) {
        if (cancelled) return
        setError(e?.message || '読み込みに失敗しました')
        setData([])
        setLoadedMonths([])
        setSource('fallback')
      }
    })()
    return () => { cancelled = true }
  }, [month, tab])

  return { data, source, loadedMonths, error }
}
