var express = require("express");
var app = express();
var path = require("path");

var publicDir = process.env.NODE_ENV === "production" ? "dist" : "public";
app.use(express.static(path.join(__dirname, publicDir)));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", function (req, res) {
  var emojis = ["thumbsup", "smile", "soccer"];
  res.render("index", {
    emojis: emojis,
  });
});

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Listening at http://%s:%s", host, port);
});

module.exports = app;
