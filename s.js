const express = require("express");
const path = require("path");
const app = express();

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"), {
    headers: {
      "X-HELLO": "WORLD!"
    }
  });
});

module.exports = app;
