const Hangout = require('../models/hangout')

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const { cloudinary } = require('../cloudinary/index')



module.exports.index = async (req, res) => {
    const hangouts = await Hangout.find({})

    res.render('hangouts/index', { hangouts})
}

module.exports.renderNewForm = (req, res) => {
    res.render('hangouts/new')
}

module.exports.createHangout = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.hangout.location,
        limit: 1
    }).send()
    const hangout = new Hangout(req.body.hangout)
    hangout.geometry = geoData.body.features[0].geometry
    hangout.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    hangout.author = req.user._id;
    await hangout.save()
    console.log(hangout)
    req.flash('success', 'Sucessfully created a new hangout!')
    res.redirect(`/hangouts/${hangout._id}`)

}

module.exports.showHangout = async (req, res) => {
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
}

module.exports.renderEditForm = async (req, res) => {
    const hangout = await Hangout.findById(req.params.id)
    if (!hangout) {
        req.flash('error', 'Ooops, hangout does not exist!')
        return res.redirect(`/hangouts`)
    }
    res.render('hangouts/edit', { hangout })
}

module.exports.updateHangout = async (req, res) => {
    const { id } = req.params;
    const hangout = await Hangout.findByIdAndUpdate(id, { ...req.body.hangout })
    const imgs = (req.files.map(f => ({ url: f.path, filename: f.filename })))
    hangout.images.push(...imgs)
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await hangout.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(hangout)
    }
    await hangout.save()
    req.flash('success', 'Sucessfully updated hangout!')
    res.redirect(`/hangouts/${hangout._id}`)
}

module.exports.deleteHangout = async (req, res) => {
    const hangout = await Hangout.findByIdAndDelete(req.params.id)
    req.flash('success', 'Sucessfully deleted hangout!')
    res.redirect(`/hangouts`)
}