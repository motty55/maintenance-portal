import React, { useState } from 'react'
import type { MaintenanceItem } from '@/types'
import { Calendar, Clock, Download, Info, Tag, Zap, RefreshCcw } from 'lucide-react'
import { SeverityBadge, StatusBadge } from './Badges'
import { fmtDateTime } from '@/utils/date'
import { toICS, downloadBlob } from '@/utils/ics'

export default function List({ items }: { items: MaintenanceItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  if (!items.length) {
    return <div className="p-8 text-center text-slate-500 text-sm">該当するメンテナンス情報はありません。</div>
  }

  return (
    <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
      <div className="grid grid-cols-12 px-4 py-3 text-xs font-semibold text-slate-500 border-b border-slate-200">
        <div className="col-span-3">日時</div>
        <div className="col-span-4">タイトル／対象</div>
        <div className="col-span-2">重要度</div>
        <div className="col-span-2">ステータス</div>
        <div className="col-span-1 text-right">ICS</div>
      </div>
      {items.map(item => (
        <div key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
          <button className="grid grid-cols-12 w-full text-left px-4 py-3 items-center" onClick={()=>setOpenId(openId===item.id?null:item.id)}>
            <div className="col-span-3 text-sm">
              <div className="font-medium">{fmtDateTime(item.start)} ～ {fmtDateTime(item.end)}</div>
              <div className="text-xs text-slate-500">ID: {item.id}</div>
            </div>
            <div className="col-span-4 text-sm">
              <div className="font-medium flex items-center gap-2">
                <Zap className="w-4 h-4" /> {item.title}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                <span className="font-semibold">{item.group}</span> ／ {item.service}
                {item.components?.length ? ` ／ ${item.components.join(', ')}` : ''}
              </div>
              {item.tags?.length ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-slate-100 rounded-full">
                      <Tag className="w-3 h-3" /> {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="col-span-2"><SeverityBadge level={item.severity} /></div>
            <div className="col-span-2"><StatusBadge status={item.status} /></div>
            <div className="col-span-1 text-right">
              <button
                onClick={(e)=>{ e.stopPropagation(); downloadBlob(toICS(item), `${item.id}.ics`) }}
                title="ICSをダウンロード"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-2 py-1 hover:bg-slate-100"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </button>
          {openId === item.id && (
            <div className="px-4 pb-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm mb-2">
                  <Info className="w-4 h-4" /> 詳細
                </div>
                <div className="grid md:grid-cols-4 gap-3 text-sm">
                  <div className="md:col-span-3">
                    <p className="leading-relaxed whitespace-pre-wrap">{item.description || "（説明なし）"}</p>
                    <p className="mt-2"><span className="font-semibold">影響:</span> {item.impact}</p>
                    {item.links?.length ? (
                      <ul className="list-disc list-inside mt-2">
                        {item.links.map((l) => (
                          <li key={l.url}>
                            <a className="text-sky-600 hover:underline" href={l.url} target="_blank" rel="noreferrer">
                              {l.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  <div className="md:col-span-1 bg-slate-50 rounded-xl p-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2 mb-1"><Calendar className="w-4 h-4" />開始</div>
                    <div className="mb-2">{fmtDateTime(item.start)}</div>
                    <div className="flex items-center gap-2 mb-1"><Clock className="w-4 h-4" />終了</div>
                    <div className="mb-2">{fmtDateTime(item.end)}</div>
                    <div className="flex items-center gap-2 mb-1"><RefreshCcw className="w-4 h-4" />ステータス</div>
                    <div className="mb-2"><StatusBadge status={item.status} /></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
