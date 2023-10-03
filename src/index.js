const express = require("express");
require("./db/db-properties");
const cors = require('cors');
const app = express();
var port;
if (process.env.NODE_ENV == "development") port = process.env.DEV_PORT || 4001;


app.use(cors());
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,Content-Type, Authorization, Accept"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();

});



app.use(express.json());

app.use("/uploads",express.static(__dirname + "./../uploads"))
const statementRouter = require('./routers/statement')(app);


app.listen(port, () => {
  console.log("Server is up on port " + port);
});

