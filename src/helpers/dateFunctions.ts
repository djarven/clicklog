import {daysShort, daysShortEn, daysLong, daysLongEn, monthsLongEn, monthsLong} from "./dateStructs"

export function getWeekdayShort(dayNum: number, lang: string) {
  if (lang === 'en') {
    return daysShortEn[dayNum]
  }
  return daysShort[dayNum]
}

export function getWeekdayLong(dayNum: number, lang: string) {
  if (lang === 'en') {
    return daysLongEn[dayNum]
  }
  return daysLong[dayNum]
}

export function getMonthLong(monthNum: number, lang: string) {
  if (lang === 'en') {
    return monthsLongEn[monthNum]
  }
  return monthsLong[monthNum]
}

export function formatHourMinute(dateStr: string) {
  const d = new Date(dateStr)
  return d.getHours() + ':' + twoDigits(d.getMinutes())
}

export function formatSoon(dateStr: string, lang: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const midnight = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const utcDate = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());

  const dayDiff = Math.floor((utcDate - midnight) / (24 * 3600 * 1000));

  let ret: string

  if (dayDiff === 0) {
    if (lang === 'en') ret = 'Today'
    else ret = 'I dag'
  } else if (dayDiff === 1) {
    if (lang === 'en') ret = 'Tomorrow'
    else ret = 'I morgon'
  } else if (dayDiff === 2) {
    if (lang === 'en') ret = 'Day after tomorrow'
    else ret = 'I övermorgon'
  } else if (dayDiff === -1) {
    if (lang === 'en') ret = 'Yesterday'
    else ret = 'I går'
  } else {
    let day = lang === 'en' ? daysLongEn : daysLong
    ret = day[dayOfWeek(d)] + ' ' + d.getDate() + '/' + (d.getMonth() + 1)
  }

  ret += ' ' + d.getHours() + ':' + twoDigits(d.getMinutes())
  return ret
}

export function isSoon(dateStr: string, minutes: number) {
  const d = new Date(dateStr)
  const now = new Date()

  const minuteDiff = (d.getTime() - now.getTime()) / (60 * 1000);

  if (minuteDiff > minutes) {
    return true
  } else {
    return false
  }
}

export function isSameDate(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

export function twoDigits(digit: number) {
  if (digit < 10) {
    return "0" + digit
  }
  return "" + digit
}

export function getWeekFromDate(d: Date) {
  const date = new Date(d.getTime())
  date.setHours(0, 0, 0, 0)
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4)
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
    - 3 + (week1.getDay() + 6) % 7) / 7)
}

export function formatDate(dateStr: string, showTime: boolean, lang: string) {
  const d = new Date(dateStr)
  let day = lang === 'en' ? daysLongEn : daysLong
  let ret = day[dayOfWeek(d)] + ' ' + d.getDate() + '/' + (d.getMonth() + 1)
  if (showTime) {
    ret += ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
  }
  return ret
}


export function formatYYYYMMDD(d: Date) {
  return d.getFullYear() + '-' + twoDigits(d.getMonth() + 1) + '-' + twoDigits(d.getDate())
}

export function formatMonthYear(d: Date) {
  return monthsLong[d.getMonth()] + ' ' + d.getFullYear()
}

export function dayOfWeek(date: Date) {
  if (date) {
    const dow = date.getDay()
    if (dow === 0) {
      return 6
    } else {
      return dow - 1
    }
  }
  return 0  // Actually an error, but should not happen
}
