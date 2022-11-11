const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((conn) => {
      console.log(
        `Mongodb database connected with host: ${conn.connection.host} `
      );
    });
};

module.exports = connectDatabase;
