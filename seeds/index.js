const mongoose = require('mongoose')
const Hangout = require('../models/hangout');
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers');


mongoose.connect('mongodb://127.0.0.1:27017/hangout', {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected")
});

const rand = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Hangout.deleteMany({})
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const hang = new Hangout({
            author: "651ede5f4082921198a00cff",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            name: `${rand(descriptors)} ${rand(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude 
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dxyu04ati/image/upload/v1697545274/HangOut/bs86njpmtylnwc2ku97d.jpg',
                    filename: 'HangOut/bs86njpmtylnwc2ku97d',

                },
                {
                    url: 'https://res.cloudinary.com/dxyu04ati/image/upload/v1697545272/HangOut/vomgovxoh5bs8psdoozn.jpg',
                    filename: 'HangOut/vomgovxoh5bs8psdoozn',

                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis nulla eligendi eius deleniti aspernatur vel natus neque maiores voluptate ipsum illo minima, at, assumenda earum inventore cumque accusamus, ad quae?',
            daysOpen: 'Monday - Saturday, 9:00am - 10:00pm'
        })
        await hang.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})