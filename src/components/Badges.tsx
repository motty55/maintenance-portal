import React from 'react'
import type { MaintenanceItem } from '@/types'
import { ShieldAlert, ChevronRight } from 'lucide-react'

export function SeverityBadge({ level }: { level: MaintenanceItem['severity'] }) {
  const map: Record<MaintenanceItem['severity'], { label: string; cls: string }> = {
    情報: { label: '情報', cls: 'bg-slate-100 text-slate-700' },
    低: { label: '低', cls: 'bg-emerald-100 text-emerald-800' },
    中: { label: '中', cls: 'bg-amber-100 text-amber-800' },
    高: { label: '高', cls: 'bg-orange-100 text-orange-800' },
    重大: { label: '重大', cls: 'bg-rose-100 text-rose-800' },
  }
  const v = map[level]
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-xl text-xs font-semibold ${v.cls}`}>
      <ShieldAlert className="w-3 h-3 mr-1" /> {v.label}
    </span>
  )
}

export function StatusBadge({ status }: { status: MaintenanceItem['status'] }) {
  const map: Record<MaintenanceItem['status'], { label: string; cls: string }> = {
    予定: { label: '予定', cls: 'bg-sky-100 text-sky-800' },
    完了: { label: '完了', cls: 'bg-emerald-100 text-emerald-800' },
    延期: { label: '延期', cls: 'bg-amber-100 text-amber-800' },
    取消: { label: '取消', cls: 'bg-slate-200 text-slate-700' },
  }
  const v = map[status]
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-xl text-xs font-semibold ${v.cls}`}>
      <ChevronRight className="w-3 h-3 mr-1" /> {v.label}
    </span>
  )
}
