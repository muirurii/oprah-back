const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer')) {
        return res.sendStatus(403);
    }

    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_SECRET, (error, decoded) => {
        if (error) {
            res.status(401).json({ message: "invalid details" });
        } else {
            const { _id, username, role } = decoded;
            console.log(decoded)
            req.auth = {
                _id,
                username,
                role
            };
            next();
        }
    })
}

module.exports = verifyToken;