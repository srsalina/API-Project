const express = require('express')
const { Spot, Review, User, SpotImage, Booking, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router()




// * ALL REVIEWS OF CURRENT USER



router.get('/current', requireAuth, async (req, res) => {
    const { user } = req
    const currentUserReviews = await Review.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }, {
                model: Spot,
                attributes: [
                    'id',
                    'ownerId',
                    'address',
                    'city',
                    'state',
                    'country',
                    'lat',
                    'lng',
                    'name',
                    'price',
                    'previewImage'
                ]
            }, {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })
    res.status(200).json({ Reviews: currentUserReviews })
})


// * EDIT REVIEW

router.put('/:reviewId', requireAuth, async (req, res, next) => {
    const revs = await Review.findByPk(req.params.reviewId)
    const { user } = req
    if (!revs) {
        res.status(404).json({ message: "Review couldn't be found" })
    }
    if (revs.userId !== user.id) {
        res.status(400).json({ message: "Can only edit your own reviews" })
    }

    const { review, stars } = req.body

    let errors = []

    if (!req.body.review) errors.push("Review text is required")
    if (req.body.stars > 5 || req.body.stars < 1 || !stars) errors.push("Stars must be an integer from 1 to 5")
    if (errors.length > 0) {
        const error = new Error("Validation error")
        err.statusCode = 400
        error.errors = errors
        return next(error)
    }
    revs.review = review
    revs.stars = stars
    await revs.save()
    res.status(200).json(revs)
})


module.exports = router
