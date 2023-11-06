const express = require('express')
const { Spot,Booking} = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { Op, Sequelize } = require("sequelize")
const router = express.Router()



//! get all CU bookings
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req
    const timeZone = 'PST'
    const currentBookings = await Booking.findAll({
        where: { userId: user.id },
        include: {
            model: Spot, attributes: [
                'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage'
            ]
        }
    })
    currentBookings.forEach((booking) => {
        const spot = booking.Spot;
        spot.lat = parseFloat(spot.lat);
        spot.lng = parseFloat(spot.lng);
        spot.price = parseFloat(spot.price);
    })

    const options = { timeZone: 'PST', year: 'numeric', month: '2-digit', day: '2-digit' }

    const fixedTimes = currentBookings.map((booking) => ({
        ...booking.toJSON(),
        startDate: booking.startDate.toLocaleDateString('en-US', options),
        endDate: booking.endDate.toLocaleDateString('en-US', options),
        updatedAt: booking.updatedAt.toLocaleString('en-US', { timeZone }),
        createdAt: booking.createdAt.toLocaleString('en-US', { timeZone })
    }))
    res.status(200).json({ Bookings: fixedTimes })
})





//! Edit a booking
router.put("/:bookingId", requireAuth, async (req, res) => {
    const { startDate, endDate } = req.body;
    const { bookingId } = req.params;
    const { user } = req;
    const timeZone = 'PST';

    
    const newStartDate = new Date(startDate).getTime();
    const newEndDate = new Date(endDate).getTime();

    
    const errorObj = {};

    if (!startDate) {
        errorObj.startDate = "Please provide a valid Start Date";
    }

    if (!endDate) {
        errorObj.endDate = "Please provide a valid End Date";
    }

    if (newEndDate <= newStartDate) {
        errorObj.endDate = "End date must come after the start date";
    }

    if (Object.keys(errorObj).length > 0) {
        return res.status(400).json({
            message: "Bad Request",
            errors: errorObj
        });
    }

    
    const currentDate = new Date().getTime();
    const testEndDate = new Date(endDate).getTime();
    if (currentDate >= testEndDate) {
        return res.status(403).json({
            message: "Past bookings can't be modified"
        });
    }

    const booking = await Booking.findByPk(bookingId, {
        attributes: ["id", "spotId", "userId", "startDate", "endDate", "createdAt", "updatedAt"]
    });

    if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
    }

    
    if (user.id !== booking.userId) {
        return res.status(403).json({
            message: "Forbidden"
        });
    }

    
    const allBookings = await Booking.findAll({
        where: {
            spotId: booking.spotId,
            id: { [Op.not]: booking.id }
        }
    });

    
    for (let currentBooking of allBookings) {
        
        const startBookDate = new Date(currentBooking.startDate).getTime();
        const endBookDate = new Date(currentBooking.endDate).getTime();

        if (newStartDate >= startBookDate && newStartDate <= endBookDate) {
            errorObj.startDate = "Start date conflicts with an existing booking";
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: errorObj
            });
        }

        if (newEndDate >= startBookDate && newEndDate <= endBookDate) {
            errorObj.endDate = "End date conflicts with an existing booking";
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: errorObj
            });
        }

        if (newStartDate < startBookDate && newEndDate > endBookDate) {
            errorObj.startDate = "Start date conflicts with an existing booking";
            errorObj.endDate = "End date conflicts with an existing booking";
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: errorObj
            });
        }

        if (newStartDate === startBookDate) {
            errorObj.startDate = "Start date conflicts with an existing booking";
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: errorObj
            });
        }

        if (newEndDate === endBookDate) {
            errorObj.endDate = "End date conflicts with an existing booking";
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: errorObj
            });
        }
    }

    // Update booking
    booking.startDate = newStartDate;
    booking.endDate = newEndDate;
    await booking.save();

    const options = { timeZone: 'PST', year: 'numeric', month: '2-digit', day: '2-digit' };
    const fixedTimes = {...booking.toJSON(),
        startDate: new Date(booking.startDate).toLocaleString('en-US', options),
        endDate: new Date(booking.endDate).toLocaleString('en-US', options),
        updatedAt: booking.updatedAt.toLocaleString('en-US', { timeZone }),
        createdAt: booking.createdAt.toLocaleString('en-US', { timeZone })
    };

    return res.status(200).json(fixedTimes);
});






//! Delete booking
router.delete("/:bookingId", requireAuth, async (req, res) => {
    const booking = await Booking.findByPk(req.params.bookingId)
    const { user } = req

    if (!booking) return res.status(404).json({ message: "Booking couldn't be found" })

    if (booking.userId !== user.id) return res.status(403).json({ message: "Forbidden" })

    const startDate = booking.startDate
    const currentDate = new Date()
    console.log(startDate, currentDate)
    if (startDate <= currentDate) return res.status(403).json({ message: "Bookings that have already started can't be deleted" })

    await booking.destroy()
    res.status(200).json({ message: "Successfully deleted" })
});



module.exports = router
