const router = require("express").Router();
const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
};

module.exports = function (passport) {
  /* GET login page. */
  router.get("/", function (req, res) {
    // Display the Login page with any flash message, if any
    res.sendFile("index.html", { root: "public" });
  });

  /* Handle Login POST */
  router.post(
    "/login",
    passport.authenticate("login", {
      successRedirect: "/dashboard",
      failureRedirect: "/login-error",
      failureFlash: true,
    })
  );

  /* GET Registration Page */
  router.get("/register", function (req, res) {
    res.sendFile("register.html", { root: "public" });
  });

  /* Handle Registration POST */
  router.post(
    "/register",
    passport.authenticate("signup", {
      successRedirect: "/",
      failureRedirect: "/register",
      failureFlash: true,
    })
  );

  /* GET Dashboard Page */
  router.get("/dashboard", isAuthenticated, function (req, res) {
    res.sendFile("dashboard.html", { root: "public", user: req.user });
  });
  /* GEt user Data */
  router.get("/datos", isAuthenticated, (req, res) => {
    res.render("datos", req.user);
  });

  /* GET login-error */
  router.get("/login-error", function (req, res) {
    res.render("login-error");
  });

  /* GET register-error */
  router.get("/register-error", function (req, res) {
    res.render("register-error");
  });

  /* Handle Logout */
  router.get("/signout", function (req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });
  return router;
};
