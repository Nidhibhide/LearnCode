const expireTime = () => {
  let time = new Date();
  time.setMinutes(time.getMinutes() + 5); //expired in 5 mins
  return time;
};

export default expireTime;
