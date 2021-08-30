const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv/config");

// Import Routes
const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");

// Import Middlewares
const verifyToken = require("./middlewares/verifyToken");

const app = express();

// Connect to DB
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .catch(error => console.error(error));

// Middlewareapi/auth
app.use(
  express.json({
    type() {
      return true;
    }
  })
);
app.use(express.urlencoded({ extended: true }));
app.use("/api", verifyToken);
app.use("/auth", authRoute);
app.use("/api/users", usersRoute);
app.use((err, req, res, next) => {
  return res.status(500).send(`Something broke!---> ${err}`);
});

// Routes
app.get("/", (req, res) => {
  return res.send("Welcome to Petish!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("App running on port:", PORT);
});
