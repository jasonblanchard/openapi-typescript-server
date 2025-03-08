import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.listen(8080, () => {
  console.log("App running on port 8080");
});
