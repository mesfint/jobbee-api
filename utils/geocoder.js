const nodeGeocoder = require("node-geocoder");
const dotenv = require("dotenv");
//settingup config file variable
dotenv.config({ path: "./config/config.env" });

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

//console.log("provider:", process.env.GEOCODER_PROVIDER);

const geoCoder = nodeGeocoder(options);

module.exports = geoCoder;
