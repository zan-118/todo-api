require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const errorMiddleWare = require("./middlewares/error");
const notFoundMiddleWare = require("./middlewares/notFound");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require("./routes");
app.get("/", (req, res) => {
  res.json({ message: "api running !!" });
});

app.use("/", routes);

const port = process.env.PORT || 5000;

app.use(notFoundMiddleWare);
app.use(errorMiddleWare);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}/`);
});
