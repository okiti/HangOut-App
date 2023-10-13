const User = require('../models/user');


module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', `Welcome to Hangout ${username}`)
            res.redirect('/hangouts')
        })

    } catch (err) {
        req.flash('error', err.message)
        res.redirect('/register')
    }
}

module.exports.renderLogin =  (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    const { username } = req.body;
    const redirectUrl = req.session.returnTo || '/hangouts';
    req.flash('success', `Welcome back ${username}`)
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err);
        req.flash('success', 'Goodbye')
        res.redirect('/hangouts')
    })
}