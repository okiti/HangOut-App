const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');


router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', `Welcome to Hangout ${username}!`)
            res.redirect('/hangouts')
        })

    } catch (err) {
        req.flash('error', err.message)
        res.redirect('/register')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), (req, res) => {
    const { username } = req.body;
    const redirectUrl = req.session.returnTo || '/hangouts';
    req.flash('success', `Welcome back ${username}`)
    delete req.session.returnTo;
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err);
        req.flash('success', 'Goodbye')
        res.redirect('/hangouts')
    })
})


module.exports = router; 