const express = require('express')
const { Spot, Review, User, SpotImage, booking, reviewImages } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router()




// * ALL REVIEWS OF CURRENT USER



router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    timeZone = 'PST';
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
                model: reviewImages,
                attributes: ['id', 'url']
            }
        ]
    })

    // conversions*********
    currentUserReviews.forEach((review) => {


        const spot = review.Spot;
        spot.lat = parseFloat(spot.lat);
        spot.lng = parseFloat(spot.lng);
        spot.price = parseFloat(spot.price);

    });

    const fixedTimeZones = currentUserReviews.map((review) => ({
        ...review.toJSON(),
        createdAt: review.createdAt.toLocaleString('en-US', { timeZone }),
        updatedAt: review.updatedAt.toLocaleString('en-US', { timeZone }),
    }));



    res.status(200).json({ Reviews: fixedTimeZones })
})


// * EDIT REVIEW

router.put('/:reviewId', requireAuth, async (req, res, next) => {
    const reviews = await Review.findByPk(req.params.reviewId)
    const { user } = req;
    const timeZone = 'PST';
    const { review, stars } = req.body


    if (!reviews) {
        res.status(404).json({ message: "Review couldn't be found" })
    }
    if (reviews.userId !== user.id) {
        res.status(403).json({ message: "Forbidden" })
    }


    let errors = []

    if (!req.body.review) errors.push("Review text is required")


    if (req.body.stars > 5 || req.body.stars < 1 || !stars) errors.push("Stars must be an integer from 1 to 5")

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Bad Request', errors: {
                review: errors[0],
                stars: errors[1]
            }
        })
    }
    reviews.review = review
    reviews.stars = stars




    await reviews.save()

    const fixedTimes = {
        ...reviews.toJSON(),
        updatedAt: reviews.updatedAt.toLocaleString('en-US', { timeZone }),
        createdAt: reviews.createdAt.toLocaleString('en-US', { timeZone })
    }
    res.status(200).json(fixedTimes)
})




// * ADD IMAGE TO REVIEW FROM REVIEW ID

router.post('/:reviewId/images', requireAuth , async (req,res) =>{
    const review = await Review.findByPk(req.params.reviewId)
    const { user } = req
    const timeZone = 'PST'
    const { url, preview } = req.body



    if(!review) {
        return res.status(404).json({
            message: "Review couldn't be found"
        })
    }

    if(review.userId !== user.id){
        return res.status(403).json({
            message: 'Forbidden'
        })
    }


    const spot = await Spot.findByPk(review.spotId)


    const reviewsImages = await reviewImages.findAll({
        where: {
            reviewId : review.id
        }
    })

    if (preview === true) spot.previewImage = url

    if(reviewsImages.length > 9) {
        return res.status(403).json({
            message: 'Maximum number of images for this resource reached'
        })
    } else {
        let newImage = await review.createReviewImage({
            url,
            reviewId: req.params.reviewId
        })

        newImage.createdAt = newImage.createdAt.toLocaleString('en-US', {timeZone})

        newImage.updatedAt = newImage.updatedAt.toLocaleString('en-US', { timeZone })


        res.status(200).json({
            id: newImage.id,
            url: newImage.url,
            reviewId: newImage.reviewId,
            updatedAt: newImage.createdAt.toLocaleString('en-US', { timeZone }),
            createdAt: newImage.updatedAt.toLocaleString('en-US', { timeZone })
        })
    }
})


// ! DELETE REVIEW

router.delete('/:reviewId', requireAuth, async (req,res) => {
    let review = await Review.findByPk(req.params.reviewId)
    const { user } = req

    if(!review){
        res.status(404).json({
            message: "Review couldn't be found"
        })
    }

    if(review.userId !== user.id){
        res.status(403).json({
            message: 'Forbidden'
        })
    }

    await review.destroy()

    res.status(200).json({
        message: 'Successfully deleted'
    })
})



module.exports = router
