//Import packages and other files
const router = require('express').Router();
const User = require('../models/auth');
const { registerValidation } = require('../validation');
const { loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Register user
router.post('/register', async(req, res) => {
    //Validate
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    //Check if user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser._id);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/login', async(req, res) => {
    //Validate
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    //Check if the email exists in the database
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email does not exists');

    //If password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid password");

    //Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
})

module.exports = router