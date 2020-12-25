const express = require('express');
const router = express.Router();
const Vehicle = require('../models/vehicleModel');
const verify = require('./verifyToken')

//Get a vehicle
router.get('/', verify, async(req, res) => {
    const vh = await Vehicle.find()
    res.json(vh);
})

//Create a vehicle
router.post('/', verify, async(req, res) => {
    const vh = new Vehicle({
        ownerName: req.body.ownerName,
        vehicleNumber: req.body.vehicleNumber,
        location: {
            time: req.body.location[0].time,
            latitude: req.body.location[0].latitude,
            longitude: req.body.location[0].longitude
        },
        maintenance: {
            fuel: [{
                litres: req.body.maintenance.fuel[0].litres,
                datetime: req.body.maintenance.fuel[0].datetime,
                amount: req.body.maintenance.fuel[0].amount
            }],
            serviceCharges: [{
                description: req.body.maintenance.serviceCharges[0].description,
                datetime: req.body.maintenance.serviceCharges[0].datetime,
                amount: req.body.maintenance.serviceCharges[0].amount
            }]
        }
    });
    try {
        const v = await vh.save();
        res.send(v);
    } catch (err) {
        console.log(err.message);
    }
})


//Update
router.patch('/:id', verify, getVehicle, async(req, res) => {
    if (req.body.location != null) {
        const loc = {
            "latitude": req.body.location.latitude,
            "longitude": req.body.location.longitude,
            "time": req.body.location.time
        }
        console.log(loc);
        res.vehicle.location.push(loc);
    }

    if (req.body.maintenance != null) {
        if (req.body.maintenance.fuel != null) {
            const fuel = {
                "litres": req.body.maintenance.fuel.litres,
                "datetime": req.body.maintenance.fuel.datetime,
                "amount": req.body.maintenance.fuel.amount
            }
            res.vehicle.maintenance.fuel.push(fuel);
        }
        if (req.body.maintenance.serviceCharges != null) {
            const serviceCharges = {
                "description": req.body.maintenance.serviceCharges.description,
                "datetime": req.body.maintenance.serviceCharges.datetime,
                "amount": req.body.maintenance.serviceCharges.amount
            }
            res.vehicle.maintenance.serviceCharges.push(serviceCharges);
        }
    }

    try {
        const updateVehicle = await res.vehicle.save()
        res.json(updateVehicle)
    } catch (err) {
        res.status(400).json({ "message": err.message })
    }
})

// //Delete one
// router.delete('/:id', getVehicle, async(req, res) => {
//     try {
//         await res.vehicle.remove()
//         res.json({ message: "Deleted Subscriber" })
//     } catch (err) {
//         res.status(500).json({
//             message: err.message
//         })
//     }
// })

router.get('/:id', verify, getVehicle, (req, res) => {
    res.send(res.vehicle);
})

async function getVehicle(req, res, next) {
    let vehicle
    try {
        vehicle = await Vehicle.findById(req.params.id)
        if (vehicle == null) {
            return res.send(404).json({
                message: "Cannot find vehicle"
            });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    res.vehicle = vehicle
    next()
}
module.exports = router;