const Hangout = require('../models/hangout')


module.exports.index = async (req, res) => {
    const hangouts = await Hangout.find({})
    res.render('hangouts/index', { hangouts })
}

module.exports.renderNewForm = (req, res) => {
    res.render('hangouts/new')
}

module.exports.createHangout = async (req, res) => {

    const hangout = new Hangout(req.body.hangout)
    console.log(hangout)
    hangout.author = req.user._id;
    await hangout.save()
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
    req.flash('success', 'Sucessfully updated hangout!')
    res.redirect(`/hangouts/${hangout._id}`)
}

module.exports.deleteHangout = async (req, res) => {
    const hangout = await Hangout.findByIdAndDelete(req.params.id)
    req.flash('success', 'Sucessfully deleted hangout!')
    res.redirect(`/hangouts`)
}