const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "build")));

app.get("/s/:id", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"), {
    headers: {
      "X-HELLO": "WORLD!"
    }
  });
});

app.listen(9001);
