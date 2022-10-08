const jwt = require("jsonwebtoken");

const refreshToken = async(req, res) => {
    if (!req.cookies && !req.cookies.refresh_) return res.sendStatus(401);

    const refToken = req.cookies.refresh_;

    jwt.verify(refToken, process.env.REFRESH_SECRET, (error, decoded) => {
        if (error) {
            res.status(401).json({ message: "invalid details" });
        } else {
            const { _id, username, role } = decoded;
            const token = jwt.sign({ _id, username, role, }, process.env.ACCESS_SECRET, { expiresIn: '1d' });

            res.json({
                _id,
                token
            })
        }
    })
}

module.exports = refreshToken;