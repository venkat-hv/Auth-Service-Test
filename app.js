const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const passport = require("./passport");
const authRouter = require("./routes/authRoute");
const router = require("./routes/route");

// Config
const app = express();
const PORT = 3000;

// Middleware (SESSION, COOKIES)
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware (PASSPORT)
app.use(passport.initialize());
app.use(passport.session());

// ROUTES
app.get("/", (req, res) => {
  return res.status(200).json({ message: "HI from AUTH SERVICE v1.00" });
});

app.use("/auth", authRouter);
app.use("/", router);

// Server
app.listen(PORT, () => {
  console.log(`AUTH server running on port: `, PORT);
});
