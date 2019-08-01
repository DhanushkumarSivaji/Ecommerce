const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const expressJwt = require("express-jwt");
const {requireSignin} = require("../middleware/auth")


//SignUP user
//@route POST api/signup

router.post(
  "/signup",
  [
    check("name", "Please add name")
      .not()
      .isEmpty(),
    check("email", "Email must be between 3 to 32 characters")
      .not()
      .isEmpty()
      .matches(/.+\@.+\..+/)
      .withMessage("Email must contain @")
      .isLength({
        min: 4,
        max: 32
      }),
    check("password", "Password is required")
      .not()
      .isEmpty(),
    check("password", "Please enter a password with 6 or more characters")
      .isLength({ min: 6 })
      .matches(/\d/)
      .withMessage("Password must contain a number")
  ],

  async (req, res) => {
    const errors = req.validationErrors();
    if (errors) {
      const firsterror = errors.map(i => i.msg)[0]
      return res.status(400).json({ msg: firsterror });
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      user = new User({
        name,
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res.json({
        user
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//Signin user
//@route POST api/signin

router.post(
  "/signin",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required")
      .not()
      .isEmpty(),
  ],
  (req, res) => {
    const errors = req.validationErrors();
    if (errors) {
      console.log(errors)
      const firsterror = errors.map(i => i.msg)[0]
      return res.status(400).json({ msg: firsterror });
    }
    const { email, password } = req.body;

    User.findOne({ email }, async (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          msg: "User with that email address does not exit.Please signup"
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const token = jwt.sign({ _id: user.id }, config.get("jwtSecret"));
      res.cookie("t", token, { expire: new Date() + 9999 });
      const { _id, name, email, role } = user;
      return res.json({ token, user: { _id, email, name, role } });
    });
  }
);

//Signout user
//@route GET api/signout

router.get("/signout", (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Signout Success" });
});


module.exports = router;
