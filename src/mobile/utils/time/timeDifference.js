// @flow

export default function(priorTime: Date | string, laterTime: Date | string) {
  const laterDate = new Date(laterTime);
  const priorDate = new Date(priorTime);

  // get total seconds between the times
  let delta = (laterDate - priorDate) / 1000;

  // calculate (and subtract) whole days
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;

  // calculate (and subtract) whole hours
  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  // calculate (and subtract) whole minutes
  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  // what's left is seconds
  const seconds = Math.floor(delta % 60); // in theory the modulus is not required

  return {
    days,
    hours,
    minutes,
    seconds
  };
}
