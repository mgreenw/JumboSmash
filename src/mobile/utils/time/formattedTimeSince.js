// @flow
import timeDifference from './timeDifference';

function fullTimeFormat(type: 'day' | 'hour' | 'minute', count: number) {
  const format = type;
  return count > 1 ? `${count} ${format}s` : format;
}

export default function(
  timestamp: string | Date,
  future?: boolean = false,
  fullTime?: boolean = false
) {
  const compareDate = new Date(timestamp);
  const nowDate = new Date();
  const { days, hours, minutes } = future
    ? timeDifference(nowDate, compareDate)
    : timeDifference(compareDate, nowDate);
  if (days > 0) {
    if (fullTime) return fullTimeFormat('day', days);
    return `${days}d`;
  }
  if (hours > 0) {
    if (fullTime) return fullTimeFormat('hour', hours);
    return `${hours}h`;
  }
  if (minutes > 0) {
    if (fullTime) return fullTimeFormat('minute', minutes);
    return `${minutes}m`;
  }

  if (fullTime) return fullTimeFormat('minute', 1);
  return `1m`;
}
