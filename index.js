const express = require("express");
const app = express();
const parse = require("body-parser");
const fetch = require("cross-fetch");
const cookieParser = require("cookie-parser");
const update_url = "https://api.jsonbin.io/v3/b/629eef9505f31f68b3b8a0af";
const read_url = "https://api.jsonbin.io/b/629eef9505f31f68b3b8a0af/latest";
app.set("view-engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(parse.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
app.use(parse.json());
app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/game", async (req, res) => {
  res.render("game.ejs");
});
app.post("/submitted", (req, res) => {
  var correct = ["a", "c", "d", "b", "c"];
  var uid = req.body.uid;
  var ans_arr = req.body.ans;
  var count = 0;
  for (i = 0; i < correct.length; i++) {
    if (correct[i] == ans_arr[i]) {
      count++;
    }
  }
  res.cookie("data", { name: uid, value: count }, { httpOnly: true });
  fetch(read_url)
    .then((response) => {
      return response.json();
    })
    .then((resp) => {
      var temp = resp;
      temp.record.push({ name: uid, score: count });

      fetch(update_url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(temp),
      });
    });
  res.json({ link: "/scores" });
});
app.get("/scores", (req, res) => {
  var userinfo = req.cookies.data;
  res.render("score.ejs", { name: userinfo.name, value: userinfo.value });
});
app.get("/leaderboard", (req, res) => {
  res.render("leaderboard.ejs");
});
app.listen(3000, (error) => {
  if (error) console.log(error);
  else console.log("running");
});
