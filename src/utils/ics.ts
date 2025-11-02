import type { MaintenanceItem } from '@/types'

const dt = (s: string) => new Date(s).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
const esc = (s: string) => s.replace(/[\n,;]/g, (m) => ({'\n':'\\n', ',':'\\,', ';':'\\;'} as Record<string,string>)[m] || m)

export function toICS(item: MaintenanceItem) {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Maintenance Portal//JP',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${item.id}@maintenance.portal`,
    `DTSTAMP:${dt(new Date().toISOString())}`,
    `DTSTART:${dt(item.start)}`,
    `DTEND:${dt(item.end)}`,
    `SUMMARY:${esc(item.title)}`,
    `DESCRIPTION:${esc((item.description || '') + '\n影響:' + item.impact)}`,
    `CATEGORIES:Maintenance`,
    `X-MAINTENANCE-GROUP:${esc(item.group)}`,
    `X-MAINTENANCE-SERVICE:${esc(item.service)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  return new Blob([ics], { type: 'text/calendar;charset=utf-8' })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
