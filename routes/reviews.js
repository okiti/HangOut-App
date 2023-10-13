const express = require('express')
const router = express.Router({ mergeParams: true });

const Hangout = require('../models/hangout')
const Review = require('../models/review')

const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware')

const ExpressError = require('../utils/ExpressError')   //handles the error//
const catchAsync = require('../utils/catchAsync')  //catches an error//


router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const hangout = await Hangout.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id;
    hangout.reviews.push(review)
    await review.save();
    await hangout.save();
    req.flash('success', 'Review created successfully!')

    res.redirect(`/hangouts/${hangout._id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const hangout = await Hangout.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Review deleted successfully!')
    res.redirect(`/hangouts/${hangout._id}`)

}))


module.exports = router;