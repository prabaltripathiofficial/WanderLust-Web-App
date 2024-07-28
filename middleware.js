const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', "You must be logged in to do this task");
        return res.redirect('/login');
    }
    next();
};

// redirectURLSaved middleware
const redirectURLSaved = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports = {
    isLoggedIn,
    redirectURLSaved
};