const { fetchMyIP, fetchCoordsByIp, fetchISSFlyOverTimes } = require("./iss");

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }
  console.log("It worked! Returned IP:", ip);
});

// fetchCoordsByIp('hello', (error, coordinates) => {
//   if (error) {
//     console.log("retrieving coordinates didn't work!", error);
//     return;
//   }
//   console.log("It worked! Returned coordinates:", coordinates);
// });

fetchISSFlyOverTimes(
  { latitude: 44.6488625, longitude: -63.5753196 },
  (flyOverTimeArr, error) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }
    console.log("It worked! Returned fly over times:", flyOverTimeArr);
  }
);
