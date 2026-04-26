const express = require("express");
const app = express();

app.use(express.json());

let keys = [];

// Generate key
app.get("/generate", (req, res) => {
  let name = req.query.name;
  let time = parseInt(req.query.time) || 60;
  let limit = parseInt(req.query.limit) || 1;

  let key = name || Math.random().toString(36).substring(2, 10).toUpperCase();

  let expiry = Date.now() + time * 60 * 1000;

  keys.push({
    key,
    expiry,
    limit,
    usedDevices: []
  });

  res.json({ key, expiry, limit });
});

// Verify key
app.get("/connect", (req, res) => {
  const userKey = req.query.key;
  const device = req.query.device || "unknown";

  const found = keys.find(k => k.key === userKey);

  if (!found) return res.json({ status: "invalid" });

  if (Date.now() > found.expiry)
    return res.json({ status: "expired" });

  if (!found.usedDevices.includes(device)) {
    if (found.usedDevices.length >= found.limit)
      return res.json({ status: "limit reached" });

    found.usedDevices.push(device);
  }

  res.json({ status: "valid", devices: found.usedDevices.length });
});

app.listen(3000);
