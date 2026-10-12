export interface TimeOptions {
  approximate?: boolean
  includeSeconds?: boolean
  whenNil?: string
}

export function distanceInTime (at: Date | null | undefined, relativeTo: Date, options: TimeOptions = {}): string {
  const { approximate = true, includeSeconds = false, whenNil = '' } = options
  if (at == null) return whenNil

  let seconds = (relativeTo.getTime() - at.getTime()) / 1000
  const future = seconds < 0
  seconds = Math.abs(seconds)

  if (!includeSeconds && seconds < 30) {
    return future ? 'in less than a minute' : 'less than a minute ago'
  }
  if (includeSeconds && seconds < 60) {
    return wrap(pluralize(Math.floor(seconds), 'second'), future)
  }

  // Buckets come from distanceInMinutes, not raw seconds re-divided per unit -- see docs/COMMENTS.md.
  const distanceInMinutes = Math.floor(seconds / 60 + 0.5)

  let text: string
  let approximable = false
  if (distanceInMinutes === 1) {
    text = '1 minute'
  } else if (distanceInMinutes <= 44) {
    text = pluralize(distanceInMinutes, 'minute')
  } else if (distanceInMinutes <= 89) {
    text = '1 hour'
    approximable = true
  } else if (distanceInMinutes <= 1439) {
    text = pluralize(Math.floor(distanceInMinutes / 60 + 0.5), 'hour')
    approximable = true
  } else if (distanceInMinutes <= 2519) {
    text = '1 day'
  } else {
    text = pluralize(Math.floor(distanceInMinutes / 1440 + 0.5), 'day')
  }

  if (approximate && approximable) text = `about ${text}`
  return wrap(text, future)
}

export function timeAgo (at: Date, options: TimeOptions = {}): string {
  return distanceInTime(at, new Date(), options)
}

function wrap (text: string, future: boolean): string {
  return future ? `in ${text}` : `${text} ago`
}

function pluralize (count: number, unit: string): string {
  return count === 1 ? `1 ${unit}` : `${count} ${unit}s`
}
