const express = require("express");

const app = express();
const port = 3000;
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(
  cors({
    origin: "http://localhost:4200",
  })
);
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});

app.post("/api/AccessToken", async function (req, res) {
  const params =
    "?client_id=" +
    req.body.client_id +
    "&client_secret=" +
    req.body.client_secret +
    "&code=" +
    req.body.code +
    "&redirect_uri=" +
    req.body.redirect_uri;
  await fetch("https://github.com/login/oauth/access_token" + params, {
    method: "POST",
    headers: {
      accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return res.send({ accessToken: data.access_token });
    })
    .catch((err) => console.log(err));
});
