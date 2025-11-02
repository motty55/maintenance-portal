export const TZ = 'Asia/Tokyo'

export function fmtDateTime(iso: string) {
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function isUpcoming(endIso: string) {
  return new Date(endIso) >= new Date()
}
