
import React, { useMemo, useState } from 'react'
import { Calendar, Clock, Download } from 'lucide-react'
import Filters from '@/components/Filters'
import List from '@/components/List'
import { useMaintenanceData } from '@/hooks/useMaintenanceData'
import { getMonthFromQuery, addMonths } from '@/utils/month'
import type { MaintenanceItem } from '@/types'

export default function App() {
  const [tab, setTab] = useState<'upcoming'|'past'>('upcoming')
  const [month, setMonth] = useState<string>(getMonthFromQuery())

  const { data, source, loadedMonths, error } = useMaintenanceData(month, tab)

  const [query, setQuery] = useState('')
  const [groupFilter, setGroupFilter] = useState('all')
  const [serviceFilter, setServiceFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [tagFilter, setTagFilter] = useState('all')
  const [rangeStart, setRangeStart] = useState('')
  const [rangeEnd, setRangeEnd] = useState('')

  const groups = useMemo(() => ['all', ...Array.from(new Set(data.map(d=>d.group)))], [data])
  const services = useMemo(() => ['all', ...Array.from(new Set(data.map(d=>d.service)))], [data])
  const tags = useMemo(() => ['all', ...Array.from(new Set(data.flatMap(d=>d.tags || [])))], [data])
  const severityOptions = ['all','情報','低','中','高','重大']
  const statusOptions = ['all','予定','完了','延期','取消']

  const filtered = useMemo(() => {
    const lowerQ = query.trim().toLowerCase()
    const start = rangeStart ? new Date(rangeStart) : null
    const end = rangeEnd ? new Date(rangeEnd) : null
    return data
      .filter(d => (tab==='upcoming' ? new Date(d.end)>=new Date() : new Date(d.end)<new Date()))
      .filter(d => groupFilter==='all' || d.group===groupFilter)
      .filter(d => serviceFilter==='all' || d.service===serviceFilter)
      .filter(d => severityFilter==='all' || d.severity===severityFilter)
      .filter(d => statusFilter==='all' || d.status===statusFilter)
      .filter(d => tagFilter==='all' || (d.tags||[]).includes(tagFilter))
      .filter(d => {
        if (!lowerQ) return true
        const text = [d.id,d.title,d.group,d.service,(d.components||[]).join(' '),(d.tags||[]).join(' '),d.impact,(d.description||'')].join(' ').toLowerCase()
        return text.includes(lowerQ)
      })
      .filter(d => {
        const st = new Date(d.start)
        if (start && st < start) return false
        if (end && st > end) return false
        return true
      })
      .sort((a,b)=> new Date(a.start).getTime() - new Date(b.start).getTime())
  }, [data, query, groupFilter, serviceFilter, severityFilter, statusFilter, tagFilter, rangeStart, rangeEnd, tab])

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' })
    const months = loadedMonths.length ? loadedMonths.join('-') : month
    const fname = `maintenance_${months}_${tab}_${Date.now()}.json`
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = fname; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
  }

  const gotoMonth = (delta: number) => {
    const next = addMonths(month, delta)
    const url = new URL(window.location.href)
    url.searchParams.set('month', next)
    window.history.replaceState(null, '', url.toString())
    setMonth(next)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6">
      <header className="max-w-6xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">ASPメンテナンス予定／履歴</h1>
          <p className="text-sm text-slate-500 mt-1">表示タイムゾーン：Asia/Tokyo（JST）</p>
          <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
            <span>データソース: {source==='json' ? (loadedMonths.length ? loadedMonths.map(mm=>`/maintenance/${mm}.json`).join(', ') : `/maintenance/${month}.json`) : '内蔵サンプル（フォールバック）'}</span>
            {error ? <span className="text-rose-600">[{error}]</span> : null}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="inline-flex rounded-2xl overflow-hidden border border-slate-200 bg-white">
            <button className="px-3 py-2 text-sm hover:bg-slate-100" onClick={()=>gotoMonth(-1)}>◀ 前月</button>
            <span className="px-3 py-2 text-sm border-x border-slate-200">{month}</span>
            <button className="px-3 py-2 text-sm hover:bg-slate-100" onClick={()=>gotoMonth(1)}>次月 ▶</button>
          </div>
          <button onClick={exportJSON} className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-white shadow hover:shadow-md border border-slate-200">
            <Download className="w-4 h-4" /> フィルタ後JSONをエクスポート
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto mt-6">
        <div className="inline-flex bg-white rounded-2xl shadow p-1 border border-slate-200">
          {[{key:'upcoming',label:'予定'},{key:'past',label:'履歴'}].map((t:any)=>(
            <button key={t.key} onClick={()=>setTab(t.key)} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab===t.key?'bg-slate-900 text-white':'text-slate-600 hover:bg-slate-100'}`}>
              <span className="inline-flex items-center gap-2">
                {t.key==='upcoming'?<Calendar className="w-4 h-4" />:<Clock className="w-4 h-4" />}{t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <section className="max-w-6xl mx-auto mt-6">
        <Filters
          query={query} setQuery={setQuery}
          groups={groups} groupFilter={groupFilter} setGroupFilter={setGroupFilter}
          services={services} serviceFilter={serviceFilter} setServiceFilter={setServiceFilter}
          tags={tags} tagFilter={tagFilter} setTagFilter={setTagFilter}
          severityOptions={severityOptions} severityFilter={severityFilter} setSeverityFilter={setSeverityFilter}
          statusOptions={statusOptions} statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          rangeStart={rangeStart} setRangeStart={setRangeStart}
          rangeEnd={rangeEnd} setRangeEnd={setRangeEnd}
        />
        <div className="mt-3 text-xs text-slate-500">※ 予定の日時はシステム都合で変更される場合があります。最新情報は本ページでご確認ください。</div>
      </section>

      <section className="max-w-6xl mx-auto mt-6">
        <List items={filtered as MaintenanceItem[]} />
      </section>

      <footer className="max-w-6xl mx-auto text-xs text-slate-500 mt-6">
        <p>※ 本ページの記載内容は予告なく変更となる場合があります。計画停止・仕様変更時は事前告知を行います。</p>
      </footer>
    </div>
  )
}
