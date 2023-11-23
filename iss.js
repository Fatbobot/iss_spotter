const { parseRequest } = require("http-signature");
const request = require("request");
const fetchMyIP = function (callback) {
  request(
    "https://api.ipify.org?format=json",
    function (error, response, body) {
      if (error) {
        return callback(error, null);
      }
      if (response.statusCode !== 200) {
        callback(
          Error(`Status Code ${response.statusCode} when fetching IP: ${body}`),
          null
        );
        return;
      }
      const parsedData = JSON.parse(body);
      const myIp = parsedData.ip
      callback(null, myIp);
    }
  );
};
// coordinate fetcher
const fetchCoordsByIp = function (ip, callback) {
  request(`http://ipwho.is/${ip}`, function (error, response, body) {
    if (error) {
      callback(error, null);
      return;
    }
    const parsedData = JSON.parse(body);
    if (parsedData.success === false) {
      console.log(
        `Error, Fetch status: ${parsedData.success}. Failed to fetch ${parsedData.ip} for reason: ${parsedData.message}`
      );
      return;
    }
    const coordObj = {
      latitude: parsedData.latitude,
      longitude: parsedData.longitude,
    };
    callback(null, coordObj);
  });
};

const fetchISSFlyOverTimes = function (coordObject, callback) {
  request(
    `https://iss-flyover.herokuapp.com/json/?lat=${coordObject.latitude}&lon=${coordObject.longitude}`,
    function (error, response, body) {
      if (error) {
        callback(error, null);
        return;
      }
      if (response.statusCode !== 200) {
        callback(
          Error(
            `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`
          ),
          null
        );
        return;
      }
      const parsedData = JSON.parse(body);
      if (!parsedData.message === "success") {
        console.log("Error:", parsedData);
        return;
      }
      const flyOverTimeArr = parsedData.response;
      callback(flyOverTimeArr, null);
    }
  );
};

const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error, null);
      return;
    }
    fetchCoordsByIp(ip, (error, coordinates) => {
      if (error) {
        return;
      }
      fetchISSFlyOverTimes(coordinates, (flyOverTimeArr, error) => {
        if (error) {
          return;
        }
        callback(flyOverTimeArr, null)
      });
    });
  });
};
module.exports = { fetchISSFlyOverTimes, fetchCoordsByIp, fetchMyIP, nextISSTimesForMyLocation};
