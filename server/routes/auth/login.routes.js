const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Import user model
const { User, loginSchema } = require("../../models/user.model");

dotenv.config();

// Create post route for logging in the user
router.post("/", async (req, res) => {
  // validate request object, if request object is invalid, return 400 error
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).send("User does not exist.");
  }

  // Check if password is correct
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).send("Invalid password.");
  }

  // Create a JSON Web Token and assign it to the user
  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  // Add the token to the response header
  res.set("Authorization", `Bearer ${token}`);

  // Send a success response with the token in the body
  return res.status(200).send({ token });
});

module.exports = router;
