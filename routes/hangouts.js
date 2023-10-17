const express = require('express');
const router = express.Router();

const hangouts = require('../controllers/hangouts')

const catchAsync = require('../utils/catchAsync')  //catches an error//

const { isLoggedIn, isAuthor, validateHangout } = require('../middleware')

const multer = require('multer')
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })

const Hangout = require('../models/hangout')

router.route('/')
    .get(catchAsync(hangouts.index))
    .post(isLoggedIn, upload.array('image'), validateHangout, catchAsync(hangouts.createHangout))


router.get('/new', isLoggedIn, hangouts.renderNewForm)

router.route('/:id')
    .get(catchAsync(hangouts.showHangout))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateHangout, catchAsync(hangouts.updateHangout))
    .delete(isLoggedIn, isAuthor, catchAsync(hangouts.deleteHangout))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(hangouts.renderEditForm))

module.exports = router;