const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    ownerName: {
        type: String,
        required: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    location: [{
        _id: false,
        time: {
            type: String,
            required: true
        },
        latitude: {
            type: String,
            required: true
        },
        longitude: {
            type: String,
            required: true
        }
    }],
    maintenance: {
        fuel: [{
            _id: false,
            litres: {
                default: 0,
                type: Number,
                required: true
            },
            datetime: {
                default: "0",
                type: String,
                required: true
            },
            amount: {
                default: 0,
                type: Number,
                required: true
            }
        }],
        serviceCharges: [{
            _id: false,
            description: {
                default: "0",
                type: String,
                required: true
            },
            datetime: {
                default: "0",
                type: String,
                required: true
            },
            amount: {
                default: 0,
                type: Number,
                required: true
            }
        }]
    }
})

module.exports = mongoose.model('Vehicle', vehicleSchema)