const { nextISSTimesForMyLocation } = require("./iss");

const printPassTimes = function (passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};
nextISSTimesForMyLocation((passTimes, error) => {
  if (error) {
    return console.log("It didn't work!", error);
  }

  printPassTimes(passTimes);
});
