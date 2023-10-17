const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

const hangoutSchema = new Schema({
    name: String,
    location: String,
    description: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [ImageSchema],
    daysOpen: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})


hangoutSchema.post('findOneAndDelete', async function (hangout) {
    if (hangout) {
        const res = await Review.deleteMany({
            _id: { $in: hangout.reviews }
        })
        console.log(res)

    }
})


module.exports = mongoose.model('Hangout', hangoutSchema)