module.exports = function (req, res, next) {
    if (!req.session.isAuthed) return res.redirect('/auth/login')
    next()
}