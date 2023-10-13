const express = require('express')
const router = express.Router({ mergeParams: true });

const Hangout = require('../models/hangout')
const Review = require('../models/review')

const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware')

const ExpressError = require('../utils/ExpressError')   //handles the error//
const catchAsync = require('../utils/catchAsync')  //catches an error//

const reviews = require('../controllers/reviews')

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))


module.exports = router;