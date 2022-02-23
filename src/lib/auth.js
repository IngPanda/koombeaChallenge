/**
 * It is used as validation middleware to allow 
 * logged in users to enter a particular route.
 */
module.exports = {
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/');
    }
};