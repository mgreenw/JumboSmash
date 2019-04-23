// @flow
import timeDifference from './timeDifference';

export default function(timestamp: string | Date) {
  const oldDate = new Date(timestamp);
  const nowDate = new Date();
  const { days, hours, minutes } = timeDifference(oldDate, nowDate);
  if (days > 0) {
    return `${days}d`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `1m`;
}
