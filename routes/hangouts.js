const express = require('express');
const router = express.Router();

const Hangout = require('../models/hangout')

const catchAsync = require('../utils/catchAsync')  //catches an error//
const ExpressError = require('../utils/ExpressError')   //handles the error//

const { hangoutSchema } = require('../schemas')
const { isLoggedIn } = require('../middleware')


const validateHangout = (req, res, next) => {
    const { error } = hangoutSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }

}


router.get('/', async (req, res) => {
    const hangouts = await Hangout.find({})
    res.render('hangouts/index', { hangouts })
})

router.get('/new', isLoggedIn, (req, res) => {

    res.render('hangouts/new')
})

router.post('/', isLoggedIn, validateHangout, catchAsync(async (req, res) => {

    const hangout = new Hangout(req.body.hangout)
    await hangout.save()
    req.flash('success', 'Sucessfully created a new hangout!')
    res.redirect(`/hangouts/${hangout._id}`)

}))

router.get('/:id', catchAsync(async (req, res) => {
    const hangout = await Hangout.findById(req.params.id).populate('reviews')
    if (!hangout) {
        req.flash('error', 'Ooops, hangout does not exist!')
        return res.redirect(`/hangouts`)
    }
    res.render('hangouts/show', { hangout })
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const hangout = await Hangout.findById(req.params.id)
    if (!hangout) {
        req.flash('error', 'Ooops, hangout does not exist!')
        return res.redirect(`/hangouts`)
    }
    res.render('hangouts/edit', { hangout })
}))

router.put('/:id', isLoggedIn, validateHangout, catchAsync(async (req, res) => {
    const { id } = req.params
    const hangout = await Hangout.findByIdAndUpdate(id, { ...req.body.hangout })
    req.flash('success', 'Sucessfully updated hangout!')
    res.redirect(`/hangouts/${hangout._id}`)
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const hangout = await Hangout.findByIdAndDelete(req.params.id)
    req.flash('success', 'Sucessfully deleted hangout!')
    res.redirect(`/hangouts`)
}))


module.exports = router;