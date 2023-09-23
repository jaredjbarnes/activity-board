const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export function secondsToMilliseconds(seconds: number) {
  return SECOND * seconds;
}

export function minutesToMilliseconds(minutes: number) {
  return MINUTE * minutes;
}

export function hoursToMilliseconds(hours: number) {
  return HOUR * hours;
}

export function daysToMilliseconds(days: number) {
  return DAY * days;
}
