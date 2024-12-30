const User = require('../models/user');
const bcrypt = require('bcryptjs');

function hashedPassword(password) {
    return bcrypt.hashSync(password, 10);
}

exports.createUser = async (req, res, next) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    try{
        const existingEmail = await User.findOne({ where: { email: email } });
        if(existingEmail) {
            return res.status(409).json({ message: "Email already exists" });
        }
        const existingPhone = await User.findOne({ where: { phone: phone } });
        if(existingPhone) {
            return res.status(409).json({ message: "Phone number already exists" });
        }
        const user = await User.create({ name: name, phone: phone, email: email, password: hashedPassword(password) });
        res.status(201).json({ message: "User created", userId: user.id });
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}