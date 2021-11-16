const secondsToMinutesAndSeconds = (time) => {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor((time / 60 - minutes) * 60);
  return `${minutes}:${seconds}`;
};

module.exports = { secondsToMinutesAndSeconds };
