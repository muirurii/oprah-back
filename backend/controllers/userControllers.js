const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async(req, res) => {
    const { username, password } = req.body;

    if (!username || !password || username.length < 2 || password.length < 2) {
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
        res.status(500).json("server error");
    }

}

const checkUser = async(username) => {
    const duplicate = await User.exists({ username });
    return duplicate;
}

const filterUserDetails = (user) => {
    const { _id, username, role, profilePic, bookmarks, likes } = user;
    const token = jwt.sign({ _id, username, role, }, process.env.ACCESS_SECRET, { expiresIn: '10s' })

    return {
        _id,
        username,
        profilePic,
        bookmarks,
        likes,
        token
    }
}

const logIn = async(req, res) => {
    const { username, password } = req.body;

    if (username.length < 2 || password.length < 2) {
        return res.status(400).json({ message: "Please fill all details" });
    }

    try {
        const user = await checkUser(username);
        if (user === null) {
            return res.status(409).json({ message: "Invalid details" });
        }
        const details = filterUserDetails(user);
        res.json(details);

    } catch (err) {
        res.status(500).json("server error");
    }
}

module.exports = {
    registerUser,
    logIn
}