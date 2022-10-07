const logOut = async(req, res) => {
    res.clearCookie("refresh_");
    res.sendStatus(204);
};

module.exports = logOut;