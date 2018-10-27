const mongoose = require("mongoose")

// REF: https://mongoosejs.com/docs/2.8.x/docs/populate.html
const reservationSchema = new mongoose.Schema({
    user: {type: 'ObjectId', ref: 'User', required: true},
    device: {type: 'ObjectId', ref: 'Device', required: true},
    from: {type: Date, required: true},
    to: {type: Date, required: true},
})

module.exports = reservationSchema