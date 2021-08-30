const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const Joi = require("@hapi/joi");
const moment = require("moment");
const nodemailer = require("nodemailer");

const { User, validateUser } = require("../models/User");
require("dotenv/config");

const PRIVATE_KEY = fs.readFileSync("./private.key", "utf8");

const router = express.Router();

router.post("/signup", async (req, res) => {
  // Input:-
  // body: emailId, password
  try {
    await validateUser(req.body);
  } catch (err) {
    return res.status(400).send(err.details[0].message);
  }

  let user = await User.findOne({ emailId: req.body.emailId }).lean();
  if (user) {
    if (user.isDeleted === true) {
      // Write code later
    } else {
      return res.status(400).send("User already exists.");
    }
  }

  const hash = await bcrypt.hash(req.body.password, 12);

  try {
    user = await User.create({
      emailId: req.body.emailId,
      password: hash
    });
    return res.status(201).send({ _id: user._id });
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    await validateUser(req.body);
  } catch (err) {
    return res.status(400).send(err.details[0].message);
  }

  const user = await User.findOne({
    emailId: req.body.emailId,
    isDeleted: false
  })
    .orFail(() => {
      return res.status(404).send("Username or password is incorrect.");
    })
    .select("+password")
    .lean();

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(404).send("Username or password is incorrect.");
  }

  // Create JWT

  try {
    const token = await jwt.sign({ _id: user._id }, PRIVATE_KEY, {
      issuer: "Petish Backend",
      audience: "Petish Frontend",
      expiresIn: 120,
      algorithm: "RS256"
    });
    return res
      .header("authorization", `Bearer ${token}`)
      .send({ _id: user._id });
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.post("/sendResetCode", async (req, res) => {
  // Validate Email
  try {
    await Joi.string()
      .email()
      .required()
      .validateAsync(req.body.emailId);
  } catch (err) {
    return res.status(400).send(err.details[0].message);
  }

  // Find user by email
  let user;
  try {
    user = await User.findOne({
      emailId: req.body.emailId,
      isDeleted: false
    })
      .select("+resetPassword")
      .orFail(() => {
        return res.status(404).send("User not found.");
      });
  } catch (err) {
    return res.status(500).send(err);
  }

  // Generate 6 digit Random Number not starting with 0

  let resetCode;

  if (
    user.resetPassword.resetCode &&
    moment().isBefore(moment(user.resetPassword.expiresAt)) &&
    user.resetPassword.verified === false
  ) {
    resetCode = user.resetPassword.resetCode;
  } else {
    resetCode = Math.floor(100000 + Math.random() * 900000);
  }

  // Send email

  const from = process.env.EMAIL_LOGIN;
  const to = user.emailId;
  const subject = "🌻 Petish Password Reset 🌻";
  const html = `
    <p>Hey ${user.emailId},</p>
    <p>We heard that you lost your Petish password. Sorry about that!</p>
    <p>But don’t worry! You can use the following code to reset your password:</p>
    <h3>${resetCode}</h3>
    <p>If you don’t use this code within 5 minutes, it will expire :(</p>
    <p>Do something new with your pet today! </p>
    <p>–Your friends at Petish</p>
    `;

  const emailTemplate = { from, to, subject, html };

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    await transporter.sendMail(emailTemplate);
  } catch (err) {
    return res.status(500).send(err);
  }

  // Add Reset Code to DB

  try {
    const resetPassword = {
      resetCode,
      createdAt: moment(),
      expiresAt: moment().add(5, "minutes"),
      verified: false
    };
    user.resetPassword = resetPassword;
    await user.save();
    return res.send("Reset code sent.");
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post("/verifyResetCode", async (req, res) => {
  // Input: emailId, resetCode

  // Validate emailId and resetCode

  try {
    const schema = Joi.object({
      emailId: Joi.string()
        .email()
        .required(),
      resetCode: Joi.number()
        .integer()
        .ruleset.min(100000)
        .max(999999)
        .rule({ message: "Reset Code must be of 6 digits only." })
        .required()
        .strict()
    });
    await schema.validateAsync(req.body);
  } catch (err) {
    return res.status(400).send(err.details[0].message);
  }

  // Find user by email
  let user;
  try {
    user = await User.findOne({
      emailId: req.body.emailId,
      "resetPassword.verified": false,
      isDeleted: false
    })
      .select("+resetPassword")
      .orFail(() => {
        return res.status(404).send("User not found or Reset Code not sent.");
      });
  } catch (err) {
    return res.status(500).send(err);
  }

  // Wrong Code
  if (
    req.body.resetCode !== user.resetPassword.resetCode ||
    moment().isSameOrAfter(moment(user.resetPassword.expiresAt))
  ) {
    return res.status(400).send("Reset code is incorrect or has expired.");
  }

  user.resetPassword.verified = true;
  user.resetPassword.verifiedAt = moment();

  try {
    await user.save();
    return res.send("Reset code verified.");
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post("/changePassword", async (req, res) => {
  // Input: emailId, password(new)

  // Validate emailId and resetCode

  try {
    const schema = Joi.object({
      emailId: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(8)
        .required()
    });
    await schema.validateAsync(req.body);
  } catch (err) {
    return res.status(400).send(err.details[0].message);
  }

  // Find user by email
  let user;
  try {
    user = await User.findOne({
      emailId: req.body.emailId,
      isDeleted: false
    })
      .select("+resetPassword")
      .orFail(() => {
        return res.status(404).send("User not found.");
      });
  } catch (err) {
    return res.status(500).send(err);
  }

  if (user.resetPassword.verified !== true)
    return res.status(400).send("Reset Code not verified.");

  // We set all resetPassword fields to null here because
  // whether IF condition passes or not, fields have to be
  // set to null anyway.

  const { verifiedAt } = user.toObject().resetPassword;
  Object.keys(user.toObject().resetPassword).forEach(key => {
    user.resetPassword[key] = null;
  });

  if (moment().diff(moment(verifiedAt), "minute") >= 5) {
    await user.save();
    return res.status(400).send("Verification has expired. Please try again.");
  }

  try {
    const hash = await bcrypt.hash(req.body.password, 12);
    user.password = hash;

    await user.save();
    return res.send("Password reset successfully.");
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
