const express = require("express");
const checkRole = require("../../middlewares/checkRole");
const { User } = require("../../models/user.model");
const router = express.Router();

router.get("/me", checkRole, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

module.exports = router;
