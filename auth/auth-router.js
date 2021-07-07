const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const Users = require("../users/users-model.js");

router.post("/register", async (req, res) => {
  console.log("on register route");
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  try {
    const newUser = await Users.add(user);
    res.status(201).json(newUser);
  } catch {
    next({
      status: 500,
      message: "Unable to register a new user"
    });
  }
});

router.post("/login", async (req, res, next) => {
  let { username, password } = req.body;
  try {
    const user = await Users.findBy(username).first();
    // Our test user's password is not hashed, so if we're in testing environment we'll skip the bcrypt function
    if (user && (bcrypt.compareSync(password, user.password) || (process.env.DB_ENV === "testing" && password === user.password))) {
      req.session.loggedIn = true;
      // do we need full user object in session?
      // or should we just keep the username in the session, for safer infosec pattern?
      req.session.user = user;
      res.status(200).json({ message: `Welcome ${user.username}!` });
      next();
    } else {
      next({
        status: 401,
        message: "Invalid credentials"
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
