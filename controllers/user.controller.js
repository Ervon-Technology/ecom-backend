const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail'); // Assuming a utility function

// Login
exports.login = async (req, res) => {
    const { emailOrPhone, password } = req.body;

    try {
        const user = await User.findOne({ where: { $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Signup
exports.signup = async (req, res) => {
    const { firstname, lastname, email, phone, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstname,
            lastname,
            email,
            phone,
            password: hashedPassword
        });

        res.json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset Password Link
exports.sendResetLink = async (req, res) => {
    const { emailOrPhone } = req.body;

    try {
        const user = await User.findOne({ where: { $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a reset token
        const resetToken = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });

        // Send reset link via email or SMS
        await sendEmail(user.email, `Reset your password: http://your_app_url/reset-password/${resetToken}`);

        res.json({ message: 'Reset link sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { resetToken, newPassword, confirmPassword } = req.body;

    try {
        const decodedToken = jwt.verify(resetToken, 'your_secret_key');
        const userId = decodedToken.userId;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};