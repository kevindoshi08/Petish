const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const ResetPasswordSchema = mongoose.Schema({
  resetCode: {
    type: Number,
    min: 100000,
    max: 999999,
    default: null
  },
  createdAt: {
    type: Date,
    default: null
  },
  expiresAt: {
    type: Date,
    default: null
  },
  verified: {
    type: Boolean,
    default: null
  },
  verifiedAt: {
    type: Date,
    default: null
  }
});

const UserSchema = mongoose.Schema(
  {
    emailId: {
      type: String,
      minlength: 3,
      maxlength: 320,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    resetPassword: {
      type: ResetPasswordSchema,
      _id: false,
      select: false,
      default: ResetPasswordSchema
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false
    }
  },
  {
    // options
    timestamps: true
  }
);

function validateUser(user) {
  const schema = Joi.object({
    emailId: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .required()
  });
  return schema.validateAsync(user);
}

exports.User = mongoose.model("User", UserSchema);
exports.validateUser = validateUser;
