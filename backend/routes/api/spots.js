const express = require('express')
const { Spot, Review, User, SpotImage, booking, reviewImages } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const router = express.Router()
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const queryFilters = require("../../utils/queryfilters");


const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Street address is required"),
    check('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("City is required"),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("State is required"),
    check('country')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Country is required"),
    check('lat')
        .exists({ checkFalsy: true })
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude is not valid"),
    check('lng')
        .exists({ checkFalsy: true })
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude is not valid"),
    check('name')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Name is required"),
    check('name')
        .isLength({ max: 50 })
        .withMessage("Name must be less than 50 character"),
    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Description is required"),
    check('price')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage("Price per day is required"),
    handleValidationErrors
]


router.get("/", queryFilters, async (req, res) => {
    const timeZone = 'EST'
    const {
        limit,
        offset,
        size,
        page,
        minLat,
        maxLat,
        minLng,
        maxLng,
        minPrice,
        maxPrice,
        where,
    } = req.pagination;

    const spots = await Spot.unscoped().findAll({
        where,
        include: [
            {
                model: SpotImage,
                attributes: ["url"],
            },
        ],
        limit,
        offset,
    });

    const jsonSpotsArray = spots.map((ele) => {
        const spotData = ele.toJSON()
        spotData.lat = parseFloat(spotData.lat);
        spotData.lng = parseFloat(spotData.lng);
        spotData.price = parseFloat(spotData.price);
        spotData.updatedAt = spotData.updatedAt.toLocaleString('en-US', { timeZone })
        spotData.createdAt = spotData.createdAt.toLocaleString('en-US', { timeZone })
        return spotData
    });

    for (let i = 0; i < jsonSpotsArray.length; i++) {
        if (jsonSpotsArray[i].SpotImages[0]) {
            jsonSpotsArray[i].previewImage = jsonSpotsArray[i].SpotImages[0].url;
            delete jsonSpotsArray[i].SpotImages;
        } else {
            jsonSpotsArray[i].previewImage = `No preview image`;
            delete jsonSpotsArray[i].SpotImages;
        }

        const sum = await Review.sum("stars", {
            where: {
                spotId: jsonSpotsArray[i].id,
            },
        });
        const total = await Review.count({
            where: {
                spotId: jsonSpotsArray[i].id,
            },
        });

        if (total > 0) {
            jsonSpotsArray[i].avgRating = sum / total;
          } else {
            jsonSpotsArray[i].avgRating = 'Spot not rated';
          }

    }

    res.json({ Spots: jsonSpotsArray, page: page, size: size });
});

//Get all Spots owned by CU
router.get('/current', requireAuth, async (req, res) => {
    const currentId = req.user.id
    const timeZone = 'EST'
    const spots = await Spot.findAll({
        where: {
            ownerId: currentId,
        },
        include: [Review, SpotImage]
    })
    let addedSpots = spots.map(async (spot) => {
        let reviews = spot.toJSON().Reviews
        let starRatings = []
        let reviewArr = []

        reviews.forEach(review => {
            let rating = review.stars
            starRatings.push(rating)
            reviewArr.push(reviews)
        });
        let sum = starRatings.reduce((prevNum, currNum) => prevNum + currNum, 0)
        let avgRating = parseFloat((sum / starRatings.length).toFixed(2))

        if (avgRating) {
            spot.avgRating = avgRating;
          } else {
            spot.avgRating = 'Spot not rated';
          }

        const spotImage = await SpotImage.findOne({ where: { spotId: spot.id } })
        if (spotImage) {
            spot.previewImage = spotImage.url;
        } else {
            spot.previewImage = `No preview image`
        }
        let rdel = spot.toJSON()
        delete rdel.Reviews
        delete rdel.SpotImages
        rdel.lat = parseFloat(rdel.lat);
        rdel.lng = parseFloat(rdel.lng);
        rdel.price = parseFloat(rdel.price);
        rdel.createdAt = rdel.createdAt.toLocaleString('en-US', { timeZone });
        rdel.updatedAt = rdel.updatedAt.toLocaleString('en-US', { timeZone });

        return rdel
    });

    addedSpots = await Promise.all(addedSpots)

    res.status(200).json({
        "Spots": addedSpots
    })
})


//!
router.get('/:spotId', async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId)
    const timeZone = 'EST'


    if (!spot) return res.status(404).json({ message: "Spot couldn't be found" })
    spot = spot.toJSON()


    const reviews = await Review.findAll({
        where: { spotId: spot.id }
    })

    const reviewCount = reviews.length


    let starRatings = []
    reviews.forEach((review) => {
        starRatings.push(review.stars)
    })
    let sum = 0
    starRatings.forEach((rating) => {
        sum += rating
    })

    const avgRating = Number((sum / starRatings.length).toFixed(2))

    const spotImages = await SpotImage.findAll({ where: { spotId: spot.id }, attributes: ['id', 'url', 'preview'] })

    const owner = await User.findByPk(spot.ownerId, { attributes: ['id', 'firstName', 'lastName'] })


    if (spotImages.length >= 1) {
        spot.previewImage = spotImages[0].url
    } else {
        spot.previewImage = `No preview image`
    }


    spot.numReviews = reviewCount

    spot.lat = parseFloat(spot.lat);
    spot.lng = parseFloat(spot.lng);
    spot.price = parseFloat(spot.price);
    spot.createdAt = spot.createdAt.toLocaleString('en-US', { timeZone });
    spot.updatedAt = spot.updatedAt.toLocaleString('en-US', { timeZone });


    if (avgRating) {
        spot.avgRating = avgRating;
      } else {
        spot.avgRating = 'Spot not rated';
      }

    spot.SpotImages = spotImages
    spot.Owner = owner
    delete spot.previewImage
    res.status(200).json(spot)
})



//! create new spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
    const userId = req.user.id
    const timeZone = 'EST'
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const newSpot = await Spot.create({
        ownerId: userId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })


    let spot = newSpot.toJSON()

    spot.lat = parseFloat(spot.lat);
    spot.lng = parseFloat(spot.lng);
    spot.price = parseFloat(spot.price);
    spot.createdAt = spot.createdAt.toLocaleString('en-US', { timeZone });
    spot.updatedAt = spot.updatedAt.toLocaleString('en-US', { timeZone });

    res.status(201).json({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        updatedAt: spot.updatedAt,
        createdAt: spot.createdAt
    })
})


//! create image for spot
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId)
    const { url, preview } = req.body


    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
        })
    }

    if (spot.ownerId !== req.user.id) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    if (preview === true) {
        spot.previewImage = url
        await spot.save()
    }


    const newImg = await spot.createSpotImage({
        url, preview
    })

    newImg.toJSON().url = url
    newImg.toJSON().preview = preview

    let image = {
        id: newImg.id,
        url,
        preview
    }
    await newImg.save()


    res.status(200).json(image)
})




//edit spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId)
    const timeZone = 'EST'
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const { user } = req
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
        })
    }
    if (spot.ownerId !== user.id) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    spot.address = address
    spot.city = city
    spot.state = state
    spot.country = country
    spot.lat = lat
    spot.lng = lng
    spot.name = name
    spot.description = description
    spot.price = price



    await spot.save()
    res.status(200).json({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        updatedAt: spot.updatedAt.toLocaleString('en-US', { timeZone }),
        createdAt: spot.createdAt.toLocaleString('en-US', { timeZone })

    })
})





//delete spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId)
    let { user } = req
    if (!spot) {
        res.status(404).json({
            message: "Spot could not be found."
        })
    }
    if (spot.ownerId !== user.id) {
        return res.status(403).json({
            message: "Forbidden"
        })
    } else {
        await spot.destroy()
        return res.status(200).json({
            message: "Successfully deleted"
        })
    }
})




//! Get reviews by  spot id

router.get('/:spotId/reviews', async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId)
    const timeZone = "EST"
    if (!spot) {
        return res.status(404).json(
            {
                message: "Spot couldn't be found"
            })
    }

    const reviews = await Review.findAll({
        where: { spotId: spot.id },
        include: [{
            model: User, attributes: ['id', 'firstName', 'lastName']
        }, {
            model: reviewImages,
            attributes: ['id', 'url']
        }]
    })

    const fixedTime = reviews.map((review) => ({...review.toJSON(),
        createdAt: review.createdAt.toLocaleString('en-US', { timeZone }),
        updatedAt: review.updatedAt.toLocaleString('en-US', { timeZone })
    }))
    res.status(200).json({ Reviews: fixedTime })
})



//! Create a review for a spot based on spotId

router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId)
    const timeZone = 'EST'
    const { spotId, review, stars } = req.body
    const { user } = req
    if (!spot) {
        return res.status(404).json(
            {
                message: "Spot couldn't be found"
            })
    }


    const reviews = await Review.findAll({
        where: { userId: user.id }
    })

    let currentReview = false
    reviews.forEach(review => {
        let revJSON = review.toJSON()
        if (revJSON.spotId == spot.id) {
            currentReview = true
        }
    })

    let errArray = []
    if (!review) errArray.push("Review text is required")
    if (req.body.stars > 5 || req.body.stars < 1 || !stars) errArray.push("Stars must be an integer from 1 to 5")
    if (errArray.length) {
        res.status(400).json({
            message: "Bad Request", errors: {
                review: errArray[0],
                stars: errArray[1]
            }
        })
        return
    }

    if (currentReview) {
        return res.status(500).json(
            {
                message: "User already has a review for this spot"
            })
    } else {
        const newReview = await spot.createReview({
            userId: user.id,
            spotId, review, stars
        })
        newReview.createdAt = newReview.createdAt.toLocaleString('en-US', { timeZone });
        newReview.updatedAt = newReview.updatedAt.toLocaleString('en-US', { timeZone });

        return res.status(201).json({
            id: newReview.id,
            userId: newReview.userId,
            spotId: newReview.spotId,
            review: newReview.review,
            stars: newReview.stars,
            updatedAt: newReview.createdAt.toLocaleString('en-US', { timeZone }),
            createdAt: newReview.updatedAt.toLocaleString('en-US', { timeZone })
        })
    }

})





//! get all current bookings by spotId
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId)
    const { user } = req
    // const timeZone = 'EST'
    if (!spot) {
        return res.status(404).json(
            {
                message: "Spot couldn't be found"
            })
    }

    if (spot.ownerId === user.id) {
        const allBookings = await booking.findAll({
            where: { spotId: spot.id },
            include: { model: User, attributes: ['id', 'firstName', 'lastName'] }
        })
        const bookingsArr = allBookings.map(booking => ({
            User: {
                id: booking.User.id,
                firstName: booking.User.firstName,
                lastName: booking.User.lastName
            },
            id: booking.id,
            spotId: booking.spotId,
            userId: booking.userId,
            startDate: booking.startDate.toLocaleDateString(),
            endDate: booking.endDate.toLocaleDateString(),
            createdAt: booking.createdAt,
            updatedAt:booking.updatedAt
        }));



        return res.status(200).json(
            {
                Bookings: bookingsArr
            });
    }

    if (spot.ownerId !== user.id) {
        const allBookings = await booking.findAll({
            where: { spotId: spot.id },
            attributes: ['spotId', 'startDate', 'endDate']
        })


        const options = { timeZone: 'GMT', year: 'numeric', month: '2-digit', day: '2-digit' }
        const fixedTime = allBookings.map(booking => ({
            spotId: booking.spotId,
            startDate: booking.startDate.toLocaleDateString('en-US', options),
            endDate: booking.endDate.toLocaleDateString('en-US', options)
        }));

        return res.status(200).json({ Bookings: fixedTime });
    }
})





//! Create a booking based on a spotId
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const { user } = req;
    const timeZone = 'EST'
    const userId = user.id;

    const spot = await Spot.findByPk(req.params.spotId);
    const body = req.body;

    if (!spot) {
        return res.status(404).json(
            {
                message: "Spot couldn't be found"
            });
    }

    if (spot.ownerId === user.id) {
        return res.status(403).json(
            {
                message: "You cannot make a booking for a spot you own"
            });
    }

    const allBookings = await booking.findAll({
        where: {
            spotId: spot.id
        }
    });

    const newStartDate = new Date(body.startDate);
    const newEndDate = new Date(body.endDate);

    for (let currBooking of allBookings) {
        const startDate = new Date(currBooking.startDate);
        const endDate = new Date(currBooking.endDate);

        if (newStartDate.getTime() === startDate.getTime() && newEndDate.getTime() === endDate.getTime()) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking"
                }
            });
        }

        if (newStartDate.getTime() === startDate.getTime()) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date on an existing start date"
                }
            });
        }

        if (newStartDate.getTime() === endDate.getTime()) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date on an existing end date"
                }
            });
        }

        if (newEndDate.getTime() === startDate.getTime()) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    endDate: "End date on an existing start date"
                }
            });
        }

        if (newEndDate.getTime() === endDate.getTime()) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    endDate: "End date on an existing end date"
                }
            });
        }

        if (newStartDate > startDate && newEndDate < endDate) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking"
                }
            });
        }

        if (newStartDate >= startDate && newStartDate < endDate) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date during an existing booking"
                }
            });
        }

        if (newEndDate > startDate && newEndDate <= endDate) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    endDate: "End date during an existing booking"
                }
            });
        }

        if (newStartDate <= startDate && newEndDate >= endDate) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking"
                }
            });
        }
    }

    if (newStartDate.getTime() === newEndDate.getTime()) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                startDate: "Start and end date are the same",
                endDate: "Start and end date are the same"
            }
        });
    }

    if (newEndDate.getTime() < newStartDate.getTime()) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                endDate: "End date cannot be before start date"
            }
        });
    }

    body.userId = userId;
    body.spotId = spot.id;
    const options = { timeZone: 'GMT', year: 'numeric', month: '2-digit', day: '2-digit' }
    const newBooking = await booking.create(body);
    await newBooking.save()
    const fixedtiming = {...newBooking.dataValues,
        startDate: newBooking.startDate.toLocaleDateString('en-US', options),
        endDate: newBooking.endDate.toLocaleDateString('en-US', options),
        createdAt: newBooking.createdAt.toLocaleString('en-US', { timeZone }),
        updatedAt: newBooking.updatedAt.toLocaleString('en-US', { timeZone }),
    };

    res.json(fixedtiming);
});





module.exports = router
