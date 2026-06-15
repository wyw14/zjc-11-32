export function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function calcProgressPct(participantCount, maxParticipants, totalChars, maxChars) {
  const pct = Math.max(
    (participantCount / maxParticipants) * 100,
    (totalChars / maxChars) * 100
  )
  return Math.min(Math.round(pct), 100)
}

export function calcRemainingChars(totalChars, maxChars) {
  return Math.max(0, maxChars - totalChars)
}

const AVATAR_COLORS = [
  '#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6',
  '#8b5cf6', '#ef4444', '#14b8a6', '#f97316', '#06b6d4'
]

export function pickAvatarColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}
