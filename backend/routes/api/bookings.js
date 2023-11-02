const express = require('express')
const { Spot, Review, User, SpotImage, Booking, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const router = express.Router()

//get all CU bookings
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req
    const currUserBookings = await Booking.findAll({
        where: { userId: user.id },
        include: {
            model: Spot, attribute: [
                'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage'
            ]
        }
    })
    res.status(200).json({ Bookings: currUserBookings })
})

//delete a booking
router.delete("/:bookingId", requireAuth, async (req, res) => {
    const booking = await Booking.findByPk(req.params.bookingId)
    const { user } = req

    if (!booking) res.status(404).json({ message: "Booking couldn't be found" })

    if (booking.userId !== user.id) res.status(400).json({ message: "Bad request" })

    const startDate = booking.startDate
    const currDate = new Date()
    console.log(startDate, currDate)
    if (startDate <= currDate) res.status(403).json({ message: "Bookings that have already started can't be deleted" })

    await booking.destroy()
    res.status(200).json({ message: "Successfully deleted" })
})
module.exports = router
