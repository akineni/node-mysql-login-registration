module.exports = {
    isLoggedIn: (req, res, next) => {
        if(req.session.isLoggedIn) return res.redirect('/dashboard')
        next()
    },
    isLoggedOut: (req, res, next) => {
        if(!req.session.isLoggedIn) return res.redirect('/login')
        next()
    }
}