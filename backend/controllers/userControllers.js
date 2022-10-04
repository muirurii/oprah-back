const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Utility fns

const checkUser = async(username) => await User.findOne({ username });

const validator = (value) => (!value || value.length < 2) ? false : true;

const filterUserDetails = (user) => {
    const { _id, username, role, profilePic, bookmarks, likes } = user;
    const token = jwt.sign({ _id, username, role, }, process.env.ACCESS_SECRET, { expiresIn: '1d' });

    return {
        _id,
        username,
        role,
        profilePic,
        bookmarks,
        likes,
        token
    }
}

//

const getUser = async(req, res) => {
    const { id } = req.params;
    const { authId, authName, role } = req.auth;

    try {
        const user = await User.findById(id);
        if (user === null) {
            return res.sendStatus(401);
        }

        if (authId !== user._id.toString()) {
            return res.sendStatus(401);
        }

        const details = filterUserDetails(user);
        res.json(details);
    } catch (err) {
        res.status(500).json({ message: "server error" });
    }
}

const getLiked = async(req, res) => {
    const { authId, authName, role } = req.auth;

    try {
        const user = User.findById(authId);
        if (user === null) {
            return res.sendStatus(401);
        }
        const populated = await User.findById(authId).populate("likes", "").populate("bookmarks");

        res.json({
            likes: populated.likes,
            bookmarks: populated.bookmarks
        })

    } catch (err) {
        res.status(500).json({ message: "server error" });
    }
}

const registerUser = async(req, res) => {
    const { username, password, repeatPassword } = req.body;

    if (!validator(username) || !validator(password) || !validator(repeatPassword)) {
        return res.status(400).json({ message: "Please fill all details" });
    }
    if (password !== repeatPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const duplicate = await checkUser(username);
        if (duplicate !== null) {
            return res.status(409).json({ message: "username is already taken" });
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
            return res.status(401).json({ message: "Wrong credentials" });
        }

        const passCheck = await bcrypt.compare(password, user.password);
        if (!passCheck) {
            return res.status(401).json({ message: "Wrong credentials" });
        }

        const details = filterUserDetails(user);
        res.cookie("blo", details.token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "None" });
        res.json(details);

    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: "server error" });
    }
}

const updateUser = async(req, res) => {
    const { username, newUsername, newPass, picUrl } = req.body;

    const { authId, authName, role } = req.auth;

    try {
        const user = await checkUser(username);
        if (user === null) {
            return res.json({ message: `User ${username} does not exist` });
        }

        if (authId !== user._id.toString()) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (validator(newPass)) {
            user.password = await bcrypt.hash(newPass, 7);
        }
        if (validator(newUsername) && newUsername !== username) {
            const duplicate = await checkUser(newUsername);
            if (duplicate !== null) {
                return res.status(409).json({ message: "username is already taken" });
            }
            user.username = newUsername;
        }

        if (validator(picUrl)) {
            user.profilePic = picUrl;
        }

        await user.save();
        const details = filterUserDetails(user);

        res.json(details);
    } catch (err) {
        res.status(500).json({ message: "server error" });
    }
}

module.exports = {
    getUser,
    registerUser,
    logIn,
    updateUser,
    getLiked
}