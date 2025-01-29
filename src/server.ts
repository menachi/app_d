import express, { Express } from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import postsRoute from "./routes/posts_route";
import commentsRoute from "./routes/comments_route";
import authRoute from "./routes/auth_route";
import fileRoute from "./routes/file_route";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
// app.use(async (req, res, next) => {
//   await new Promise((resolve) => setTimeout(resolve, 3000));
//   next();
// });
app.use("/posts", postsRoute);
app.use("/comments", commentsRoute);
app.use("/auth", authRoute);
app.use("/file", fileRoute);

app.get("/about", (req, res) => {
  res.send("Hello World!");
});

app.use("/public", express.static("public"));
app.use("/storage", express.static("storage"));
app.use(express.static("front"));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Dev 2025 - D - REST API",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [{ url: "http://localhost:" + process.env.PORT, },
    { url: "http://10.10.248.100", },
    { url: "https://10.10.248.100", }],
  },
  apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const initApp = () => {
  return new Promise<Express>(async (resolve, reject) => {
    if (process.env.DB_CONNECTION == undefined) {
      reject("DB_CONNECTION is not defined");
    } else {
      await mongoose.connect(process.env.DB_CONNECTION);
      resolve(app);
    }
  });
};

export default initApp;