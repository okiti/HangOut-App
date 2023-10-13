const express = require('express')
const router = express.Router({ mergeParams: true });

const Hangout = require('../models/hangout')
const Review = require('../models/review')

const catchAsync = require('../utils/catchAsync')  //catches an error//
const ExpressError = require('../utils/ExpressError')   //handles the error//

const { reviewSchema } = require('../schemas')


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }

}


router.post('/', validateReview, catchAsync(async (req, res) => {
    const hangout = await Hangout.findById(req.params.id)
    const review = new Review(req.body.review)
    hangout.reviews.push(review)
    await review.save();
    await hangout.save();
    req.flash('success', 'Review created successfully!')

    res.redirect(`/hangouts/${hangout._id}`)
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const hangout = await Hangout.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Review deleted successfully!')
    res.redirect(`/hangouts/${hangout._id}`)

}))


module.exports = router;