const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Utility fns

const checkUser = async(username) => await User.findOne({ username });

const validator = (value) => (!value || value.length < 2) ? false : true;

const filterUserDetails = (user) => {
    const { _id, username, role, profilePic, bookmarks, likes } = user;
    const token = jwt.sign({ _id, username, role, }, process.env.ACCESS_SECRET, { expiresIn: '1d' })

    return {
        _id,
        username,
        profilePic,
        bookmarks,
        likes,
        token
    }
}

//

const registerUser = async(req, res) => {
    const { username, password } = req.body;

    if (!validator(username) || !validator(password)) {
        return res.status(400).json({ message: "Please fill all details" });
    }

    try {
        const duplicate = await checkUser(username);
        if (duplicate !== null) {
            return res.json({ message: "username unavailable" });
        }
        const encryptedPassword = await bcrypt.hash(password, 6);
        const user = await User.create({ username, password: encryptedPassword });

        const details = filterUserDetails(user);
        res.json(details)
    } catch (err) {
        res.status(500).json({ message: "server error" });
    }

}

const logIn = async(req, res) => {
    const { username, password } = req.body;

    if (!validator(username) || !validator(password)) {
        return res.status(400).json({ message: "Please fill all details" });
    }

    try {
        const user = await checkUser(username);

        if (user === null) {
            return res.status(409).json({ message: "Invalid details" });
        }

        const passCheck = await bcrypt.compare(password, user.password);
        if (!passCheck) {
            return res.status(409).json({ message: "Wrong credentials" });
        }

        const details = filterUserDetails(user);
        res.json(details);

    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: "server error" });
    }
}

const updateUser = async(req, res) => {
    const { username, password, newUsername, newPass, newProfilePic } = req.body;
    if (!validator(username) || !validator(password)) {
        return res.status(400).json({ message: "Please fill all details" });
    }

    const { authId, authName, role } = req.auth;

    try {
        const user = await checkUser(username);
        if (user === null) {
            return res.json({ message: `User ${username} does not exist` });
        }

        if (authId !== user._id.toString()) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        if (validator(newPass)) {
            user.password = await bcrypt.hash(newPass, 7);
        }
        if (validator(newUsername)) {
            user.username = newUsername;
        }
        if (validator(newProfilePic)) {
            user.profilePic = newProfilePic;
        }

        await user.save();
        const details = filterUserDetails(user);

        res.json(details);
    } catch (err) {
        res.status(500).json({ message: "server error" });
    }
}

module.exports = {
    registerUser,
    logIn,
    updateUser
}