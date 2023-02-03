"use strict";
const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path");
const loggerDEV = require("morgan");
const logger = require("./utils/logger");

const app = express();
//!configuracion de puerto
app.set("port", process.env.APP_PORT);
const config = require("./config");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect(config.dbConfig.mongodb.cnxStr);
const socket = require("socket.io");

//!view engine setup
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(loggerDEV("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
//avatar images
app.use("/public", express.static(`${__dirname}/storage/images/avatars`));

//!PASSPORT
const passport = require("passport");
const expressSession = require("express-session");
const initPassport = require("./passport/init");
initPassport(passport);
//Use the session middleware
app.use(
  expressSession({
    secret: "shhhhhhhhhhhhhhhhhhhhh",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
const flash = require("connect-flash");
app.use(flash());
//!listen
const server = app.listen(app.get("port"), () => {
  logger.info(`Servidor escuchando en el puerto ${app.get("port")}`);
});

//!SOCKET.IO
const io = socket(server);
io.on("connection", (socket) => {
  socket.on("change-list", () => {
    io.sockets.emit("refresh-new-products");
  });
  socket.on("change-list-cart", () => {
    socket.emit("refresh-new-products-cart");
  });
});

/* //!ERRORHANDLER MIDDLEWARE
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler); */
//!AUTH MIDDLEWARE
app.use("/", require("./routes/auth")(passport));
/* const auth = require("./middlewares/auth");
app.use(auth); */

//!ROUTES
app.use("/", require("./routes/primary"));
app.use("/api", require("./routes/info"));
app.use("/api/product", require("./routes/product"));
/* app.use("/api/cart", require("./routes/cart")); */

//!catch 404
app.use((req, res, next) => {
  res.status(404).render("404");
});



module.exports = app;
