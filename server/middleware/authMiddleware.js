const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Adjust path as necessary

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.body.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch the user from the database
        const user = await User.findById(decoded._id); // Ensure you have the correct user model imported
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user; // Attach the user object to req.user
        console.log('Authenticated user:', req.user); // Log for debugging
        next();
    } catch (err) {
        console.error('Error in authMiddleware:', err); // Log any errors
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = authMiddleware;
