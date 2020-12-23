module.exports = {
    checkAuth: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }

        req.flash('error_msg', 'Log in to access dashboard');
        res.redirect('/login');
    }
}