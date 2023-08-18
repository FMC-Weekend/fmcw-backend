module.exports = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    else {
        res.status(401).json({
            message: 'You need to be authenticated'
        })
    }
}