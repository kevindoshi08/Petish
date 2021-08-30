const express = require("express");
const Joi = require("@hapi/joi");
const { User } = require("../models/User");

const router = express.Router();

// Get all users

// router.get("/", async (req, res) => {
//   try {
//     const users = await User.find({ isDeleted: false })
//       .limit(10)
//       .lean();

//     // res.locals.response.data = users.map(x => x.toObject());
//     res.locals.response.data = users;
//     return res.send(res.locals.response);
//   } catch (err) {
//     res.locals.response.error = err;
//     return res.status(500).send(res.locals.response);
//   }
// });

// Get a particular user by id
router.get("/", async (req, res) => {
  try {
    const user = await User.findById(
      {
        _id: req.tokenPayload._id,
        isDeleted: false
      },
      "-__v"
    )
      .orFail(() => {
        return res.status(404).send("User not found.");
      })
      .lean();

    return res.send(user);
  } catch (err) {
    return res.status(500).send(err);
  }
});

// Update a user
router.put("/:id", (req, res) => {
  const user = users.find(c => c.id === parseInt(req.params.id, 10));
  if (!user) {
    return res.status(404).send("User does not exist.");
  }

  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .required()
  });
  const { error } = schema.validate({ name: req.body.name });
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  user.name = req.body.name;
  return res.send(user);
});

router.delete("/:emailId", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      {
        emailId: req.params.emailId,
        isDeleted: false
      },
      { isDeleted: true },
      { new: true }
    )
      .orFail(() => {
        return res.status(404).send("User not found.");
      })
      .lean();

    return res.status(201).send(user);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
