const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());
app.get("/items", (req, res) => {
  res.status(200).json(require("./fake-data"));
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(port, () => {
  console.log(`Serivce is running on ${port}`);
});
