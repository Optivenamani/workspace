const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

// Import user model
const { User, registerSchema } = require("../../models/user.model");

// Create post route for creating a new user
router.post("/", async (req, res) => {
  // Validate request object, if request object is invalid, return 400 error
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { email, password, role, name } = req.body;

  // Check if user already exists
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).send("User already exists");
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create the user
  const newUser = new User({ name, role, email, password: hashedPassword });
  await newUser.save();

  // Save new user to database/send back error message
  try {
    await newUser.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
