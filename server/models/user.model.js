const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 3,
    max: 255,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [
      "marketer",
      "staff",
      "head of logistics",
      "driver",
      "sales manager",
      "regional manager",
      "head of sales",
      "general manager",
      "operations manager",
      "data analyst",
    ],
    required: true,
  },
});

// Define a User model while creating a users collection
const User = mongoose.model("user", userSchema);

// JOI VALIDATION SCHEMAS
// Registration validation schema
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  password: Joi.string().min(6).max(1024).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["co", "ke", "com"] },
  }),
  role: Joi.string()
    .valid(
      "marketer",
      "staff",
      "head of logistics",
      "driver",
      "sales manager",
      "regional manager",
      "head of sales",
      "general manager",
      "operations manager",
      "data analyst"
    )
    .required(),
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["co", "ke", "com"] },
  }),
  password: Joi.string().min(6).max(1024).required(),
});

// Export User model
module.exports.User = User;
// Export validations schemas
module.exports.registerSchema = registerSchema;
module.exports.loginSchema = loginSchema;
