const express = require('express');
const router = express.Router();

const Hangout = require('../models/hangout')

const catchAsync = require('../utils/catchAsync')  //catches an error//

const { isLoggedIn, isAuthor, validateHangout } = require('../middleware')


router.get('/', async (req, res) => {
    const hangouts = await Hangout.find({})
    res.render('hangouts/index', { hangouts })
})

router.get('/new', isLoggedIn, (req, res) => {

    res.render('hangouts/new')
})

router.post('/', isLoggedIn, validateHangout, catchAsync(async (req, res) => {

    const hangout = new Hangout(req.body.hangout)
    console.log(hangout)
    hangout.author = req.user._id;
    await hangout.save()
    req.flash('success', 'Sucessfully created a new hangout!')
    res.redirect(`/hangouts/${hangout._id}`)

}))

router.get('/:id', catchAsync(async (req, res) => {
    const hangout = await Hangout.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author')

    if (!hangout) {
        req.flash('error', 'Ooops, hangout does not exist!')
        return res.redirect(`/hangouts`)
    }
    res.render('hangouts/show', { hangout })
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const hangout = await Hangout.findById(req.params.id)
    if (!hangout) {
        req.flash('error', 'Ooops, hangout does not exist!')
        return res.redirect(`/hangouts`)
    }
    res.render('hangouts/edit', { hangout })
}))

router.put('/:id', isLoggedIn, isAuthor, validateHangout, catchAsync(async (req, res) => {
    const { id } = req.params;
    const hangout = await Hangout.findByIdAndUpdate(id, { ...req.body.hangout })
    req.flash('success', 'Sucessfully updated hangout!')
    res.redirect(`/hangouts/${hangout._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const hangout = await Hangout.findByIdAndDelete(req.params.id)
    req.flash('success', 'Sucessfully deleted hangout!')
    res.redirect(`/hangouts`)
}))


module.exports = router;