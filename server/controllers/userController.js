const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

//Register User
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ newUser, token, message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//Login User
exports.login = async(req,res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({message: 'All fields are required'});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message: 'User does not exist'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({message: 'Invalid credentials'});
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.status(200).json({email, token});
}

//Get user
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

