const express = require("express");
const app = express();

app.use(express.json());

let keys = [];

app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

app.post("/generate", (req, res) => {
  const key = Math.random().toString(36).substring(2, 10).toUpperCase();
  keys.push(key);
  res.json({ key });
});

app.get("/connect", (req, res) => {
  const key = req.query.key;

  if (!keys.includes(key)) {
    return res.json({ status: "invalid" });
  }

  res.json({ status: "valid" });
});

app.listen(3000);