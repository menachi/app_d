const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;

const postsRoute = require("./routes/posts_route");
app.use("/posts", postsRoute);

app.get("/about", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
