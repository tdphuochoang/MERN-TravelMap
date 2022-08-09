const router = require("express").Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		});

		const user = await newUser.save();
		res.status(200).json(user._id);
	} catch (err) {
		res.status(500).json(err);
	}
});
//LOGIN
router.post("/login", async (req, res) => {
	try {
		//find user
		const user = await User.findOne({ username: req.body.username });
		if (!user) return res.status(400).json("Wrong username or password");
		//validate password
		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword) return res.status(400).json("Wrong password!");
		const { password, ...others } = user._doc;
		//Send res
		res.status(200).json(others);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
