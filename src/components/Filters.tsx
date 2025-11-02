import React from 'react'
import { Search } from 'lucide-react'

type Props = {
  query: string; setQuery: (v: string) => void
  groups: string[]; groupFilter: string; setGroupFilter: (v: string) => void
  services: string[]; serviceFilter: string; setServiceFilter: (v: string) => void
  tags: string[]; tagFilter: string; setTagFilter: (v: string) => void
  severityOptions: string[]; severityFilter: string; setSeverityFilter: (v: string) => void
  statusOptions: string[]; statusFilter: string; setStatusFilter: (v: string) => void
  rangeStart: string; setRangeStart: (v: string) => void
  rangeEnd: string; setRangeEnd: (v: string) => void
}

export default function Filters(props: Props) {
  const {query,setQuery,groups,groupFilter,setGroupFilter,services,serviceFilter,setServiceFilter,
    tags,tagFilter,setTagFilter,severityOptions,severityFilter,setSeverityFilter,statusOptions,statusFilter,setStatusFilter,
    rangeStart,setRangeStart,rangeEnd,setRangeEnd} = props

  return (
    <div className="bg-white rounded-2xl p-4 md:p-5 shadow border border-slate-200">
      <div className="grid md:grid-cols-7 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">グループ</label>
          <select value={groupFilter} onChange={(e)=>setGroupFilter(e.target.value)} className="w-full py-2 px-3 rounded-xl border border-slate-300">
            {groups.map(g=> <option key={g} value={g}>{g==='all'?'すべて':g}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">サービス</label>
          <select value={serviceFilter} onChange={(e)=>setServiceFilter(e.target.value)} className="w-full py-2 px-3 rounded-xl border border-slate-300">
            {services.map(s=> <option key={s} value={s}>{s==='all'?'すべて':s}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-slate-500 mb-1">検索</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="キーワード（タイトル／ID／説明 など）"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">重要度</label>
          <select value={severityFilter} onChange={(e)=>setSeverityFilter(e.target.value)} className="w-full py-2 px-3 rounded-xl border border-slate-300">
            {severityOptions.map(s=> <option key={s} value={s}>{s==='all'?'すべて':s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">ステータス</label>
          <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className="w-full py-2 px-3 rounded-xl border border-slate-300">
            {statusOptions.map(s=> <option key={s} value={s}>{s==='all'?'すべて':s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">タグ</label>
          <select value={tagFilter} onChange={(e)=>setTagFilter(e.target.value)} className="w-full py-2 px-3 rounded-xl border border-slate-300">
            {tags.map(t=> <option key={t} value={t}>{t==='all'?'すべて':t}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-slate-500 mb-1">開始日(UTC基準)</label>
            <input type="datetime-local" value={rangeStart} onChange={(e)=>setRangeStart(e.target.value)} className="w-full py-2 px-3 rounded-xl border border-slate-300" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">終了日(UTC基準)</label>
            <input type="datetime-local" value={rangeEnd} onChange={(e)=>setRangeEnd(e.target.value)} className="w-full py-2 px-3 rounded-xl border border-slate-300" />
          </div>
        </div>
      </div>
    </div>
  )
}
