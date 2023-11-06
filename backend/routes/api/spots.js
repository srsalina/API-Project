const express = require('express')
const { Spot, Review, User, SpotImage, Booking, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { validator } = require('../../utils/validation')
const queryFilter = require('../../utils/queryfilters')
const router = express.Router()




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
        .withMessage("Price per day is required"),
    validator
]



// * GET ALL SPOTS
router.get('/',queryFilter ,async (req, res) => {
    const timeZone = 'PST'

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
        where
    } = req.pagination;

    const spots = await Spot.unscoped().findAll({
        include: [
            {
                model: SpotImage,
                attributes: ['url']
            }
        ],
        limit,
        offset
    })

    const jsonSpotsArray = spots.map((element) =>{
        const data = element.toJSON();
        data.lat = parseFloat(data.lat);
        data.lng = parseFloat(data.lng);
        data.price = parseFloat(data.price);
        data.createdAt = data.createdAt.toLocaleString('en-US', {timeZone});
        data.updatedAt = data.updatedAt.toLocaleString('en-US',)
        return data
    })


    for(let i = 0; i < jsonSpotsArray.length; i++){
        if(jsonSpotsArray[i].SpotImages[0]) {
            jsonSpotsArray[i].previewImage = jsonSpotsArray[i].SpotImages[0].url;
            delete jsonSpotsArray[i].SpotImages;
        } else {
            jsonSpotsArray[i].previewImage = 'No preview image available';
            delete jsonSpotsArray[i].SpotImages
        }
    }

    let sum = await Review.sum('stars', {
        where: {
            spotId: jsonSpotsArray[i].id
        }
    })

    let total = await Review.count({
        where: {
            spotId: jsonSpotsArray[i].id
        }
    })


    if (total > 0) {
        jsonSpotsArray[i].avgRating = sum / total;
      } else {
        jsonSpotsArray[i].avgRating = 'Spot not rated';
      }

      res.json({
        Spots: jsonSpotsArray,
        page: page,
        size: size
    })
})



// * GET ALL SPOTS OWNED BY ---CURRENT USER---
router.get("/current", requireAuth, async (req, res) => {
    const currentUserId  = req.user.id;
    const timeZone ='PST';
    const spots = await Spot.findAll({
        where: {
            ownerId: currentUserId
        }, include :[
            Review,
            SpotImage
        ]
    })
    let addsArray = spots.map( async (spot) => {
        let reviews = spot.toJSON().Reviews
        let starRatings = []
        let reviewArray = []

        reviews.forEach(review => {
            let rating = review.stars
            starRatings.push(rating)
            reviewArray.push(reviews)
        });

        let sumRatings = starRatings.reduce((prevNum, currNum) => prevNum + currNum, 0)

        let avgRating = parseFloat((sumRatings/starRatings.length).toFixed(2))
        
        if (avgRating) {
            spot.avgRating = avgRating;
          } else {
            spot.avgRating = 'Spot not rated';
          }
          
        const spotImage = await SpotImage.findOne({
            where: {
                spotId: spot.id
            }
        })

        if(spotImage){
            spot.previewImage = spotImage.url
        } else {
            spot.previewImage = 'No preview image'
        }

        let rdelete = spot.toJSON();
        delete rdelete.Reviews
        delete rdelete.SpotImages
        
        rdelete.lat = parseFloat(rdelete.lat);
        rdelete.lng = parseFloat(rdelete.lng);
        rdelete.price = parseFloat(rdelete.price);
        rdelete.createdAt = rdelete.createdAt.toLocaleString('en-US', { timeZone });
        rdelete.updatedAt = rdelete.updatedAt.toLocaleString('en-US', { timeZone });

        return rdelete
        
    });

    addsArray = await Promise.all(addsArray)


    res.status(200).json({"Spots": addsArray})
})


//get details of a Spot from an id---------------------

router.get("/:id", async (req, res) => {
    let spot = await Spot.findByPk(req.params.id)
    const timeZone = 'PST'
    if (!spot) {
        res.status(400).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    spot = spot.toJSON()

    const reviews = await Review.findAll({
        where: {spotId :spot.id}
    })
    const numReviews = reviews.length


    // * create an array of staratings

    let starRatings = [];

    reviews.forEach((review) =>{
        starRatings.push(review.stars)
    });

    let total = 0;

    starRatings.forEach((starRating) =>{
        total += starRating
    })

    const averageRating = Number((total/starRatings.length).toFixed(2))

    const spotImage = await SpotImage.findAll(
        {
            where: {
                spotId: spot.id
            },
            attributes: ['id','url','preview']
        }
    )

    const owner = await User.findByPk(spot.ownerId, {
        attributes: ['id','firstName','lastName']
    })

    if (spotImage.length >= 1) {
        spot.previewImage = spotImage[0].url
    } else {
        spot.previewImage = 'No preview image'
    }

    spot.numReviews = numReviews;

    spot.avgRating = averageRating;
    if (avgRating) {
        spot.avgRating = avgRating;
      } else {
        spot.avgRating = 'Spot not rated';
      }
      
    spot.Owner = owner


    spot.lat = parseFloat(spot.lat);
    spot.lng = parseFloat(spot.lng);
    spot.price = parseFloat(spot.price);
    spot.createdAt = spot.createdAt.toLocaleString('en-US', { timeZone });
    spot.updatedAt = spot.updatedAt.toLocaleString('en-US', { timeZone });


    res.json(spot)

})



//create a Spot

router.post("/", requireAuth, validateSpot,async (req, res) => {
    const ownerId = req.user.id
    const timeZone = 'PST'
    const { address, city, state, country, lat, lng, name, description, price} = req.body;

    const newSpot = await Spot.create({
        ownerId: ownerId,
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


//Add an Image to a Spot(based on spot Id)
router.post("/:id/images", requireAuth, async (req, res) => {
    const {url, preview } = req.body;
    const spot = await Spot.findByPk(req.params.id);


    if (!spot) {
        res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    if (spot.ownerId !== req.user.id) {// current user id
        res.json({
            message: "Forbidden",
            statusCode: 400,
        })
    }


    if (preview === true) {
        spot.previewImage = url
        await spot.save() 
    }

    const newimage = await spot.createImage(
        {
        url,
        preview
        }
    )

    newimage.toJSON().url = url;
    newimage.toJSON().preview = preview;

    let image = {
        id: newimage.id,
        url,
        preview
    }

    await newimage.save();
    res.status(200).json(image)

})




//edit a Spot
router.put("/:id", validateSpot, requireAuth, async (req, res) => {
    let spot = await Spot.findByPk(req.params.id)
    timeZone = 'PST'
    const { id, address, city, state, country, lat, lng, name, description, price} = req.body;
    // const { user } = req


    if (!spot) {
        res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    if (spot.ownerId !== req.user.id) {
        res.json({
            message: "Validation error",
            statusCode: 400,
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

// delete a Spot
router.delete("/:id", requireAuth, async (req, res) => {
    let { user } = req
    let spot = await Spot.findByPk(req.params.id)

    if (!spot) {
        res.status(404).json({
            message: "Spot could not be found",
            statusCode: 404
        })
    }

    if (spot.ownerId !== user.id) {
        res.json({
            message: "Validation error",
            statusCode: 400,
        })
    } else {
        await spot.destroy()
        res.status(200).json({
            message: "Spot Successfully deleted"
        })
    }

})

//Get all reviews by a Spot's id

router.get('/:spotId/reviews', async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId)
    const timeZone = "PST"
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" })
    }

    const reviews = await Review.findAll({
        where: { spotId: spot.id },
        include: [{
            model: User, attributes: ['id', 'firstName', 'lastName']
        }, {
            model: ReviewImage,
            attributes: ['id', 'url']
        }]
    })
    
    const formatRevs = reviews.map((review) => ({...review.toJSON(),
        createdAt: review.createdAt.toLocaleString('en-US', { timeZone }),
        updatedAt: review.updatedAt.toLocaleString('en-US', { timeZone })
    }))
    res.status(200).json({ Reviews: formatRevs })
})



// create a review for a spot based on spotId

router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId)
    const timeZone = 'PST'
    const { spotId, review, stars } = req.body
    const { user } = req
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" })
    }


    const reviews = await Review.findAll({
        where: { userId: user.id }
    })

    let currentReview = false
    reviews.forEach(review => {
        let revJ = review.toJSON()
        if (revJ.spotId == spot.id) {
            currentReview = true
        }
    })

    let errors = []
    if (!review) errors.push("Review text is required")
    if (req.body.stars > 5 || req.body.stars < 1 || !stars) errors.push("Stars must be an integer from 1 to 5")
    if (errors.length) {
        res.status(400).json({
            message: "Bad Request", errors: {
                review: errors[0],
                stars: errors[1]
            }
        })
        return
    }

    if (currentReview) {
        return res.status(500).json({ message: "User already has a review for this spot" })
    } else {
        const newRev = await spot.createReview({
            userId: user.id,
            spotId, review, stars
        })
        newRev.createdAt = newRev.createdAt.toLocaleString('en-US', { timeZone });
        newRev.updatedAt = newRev.updatedAt.toLocaleString('en-US', { timeZone });

        return res.status(201).json({
            id: newRev.id,
            userId: newRev.userId,
            spotId: newRev.spotId,
            review: newRev.review,
            stars: newRev.stars,
            updatedAt: newRev.createdAt.toLocaleString('en-US', { timeZone }),
            createdAt: newRev.updatedAt.toLocaleString('en-US', { timeZone })
        })
    }

})

// get all current bookings by spotId
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId)
    const { user } = req
    const timeZone = 'PST'
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" })
    }

    if (spot.ownerId === user.id) {
        const allBookings = await Booking.findAll({
            where: { spotId: spot.id },
            include: { model: User, attributes: ['id', 'firstName', 'lastName'] }
        })
        const bookingsArray = allBookings.map(booking => ({
            spotId: booking.spotId,
            startDate: booking.startDate.toLocaleDateString(),
            endDate: booking.endDate.toLocaleDateString()
        }));

        return res.status(200).json({ Bookings: bookingsArray });
    }
    if (spot.ownerId !== user.id) {
        const allBookings = await Booking.findAll({
            where: { spotId: spot.id },
            attributes: ['spotId', 'startDate', 'endDate']
        })
        const options = { timeZone: 'PST', year: 'numeric', month: '2-digit', day: '2-digit' }
        const bookingsArray = allBookings.map(booking => ({
            spotId: booking.spotId,
            startDate: booking.startDate.toLocaleDateString('en-US', options),
            endDate: booking.endDate.toLocaleDateString('en-US', options)
        }));

        return res.status(200).json({ Bookings: bookingsArray });
    }
})

// * Create a booking based on a spotId
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const { user } = req;
    const timeZone = 'PST'
    const userId = user.id;

    const spot = await Spot.findByPk(req.params.spotId);
    const body = req.body;

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId === user.id) {
        return res.status(403).json({ message: "You cannot make a booking for a spot you own" });
    }

    const bookings = await Booking.findAll({
        where: {
            spotId: spot.id
        }
    });

    const newStartDate = new Date(body.startDate);
    const newEndDate = new Date(body.endDate);

    for (let currentBooking of bookings) {
        const currentStart = new Date(currentBooking.startDate);
        const currentEndDate = new Date(currentBooking.endDate);

        if (newStartDate.getTime() === currentStart.getTime() && newEndDate.getTime() === currentEndDate.getTime()) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking"
                }
            });
        }

        if (newStartDate.getTime() === currentStart.getTime()) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date on an existing start date"
                }
            });
        }

        if (newStartDate.getTime() === currentEndDate.getTime()) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date on an existing end date"
                }
            });
        }

        if (newEndDate.getTime() === currentStart.getTime()) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    endDate: "End date on an existing start date"
                }
            });
        }

        if (newEndDate.getTime() === currentEndDate.getTime()) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    endDate: "End date on an existing end date"
                }
            });
        }

        if (newStartDate > currentStart && newEndDate < currentEndDate) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking"
                }
            });
        }

        if (newStartDate >= currentStart && newStartDate < currentEndDate) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date during an existing booking"
                }
            });
        }

        if (newEndDate > currentStart && newEndDate <= currentEndDate) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    endDate: "End date during an existing booking"
                }
            });
        }

        if (newStartDate <= currentStart && newEndDate >= currentEndDate) {
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
    const options = { timeZone: 'PST', year: 'numeric', month: '2-digit', day: '2-digit' }
    const newBooking = await Booking.create(body);
    await newBooking.save()
    const books = {...newBooking.dataValues,
        startDate: newBooking.startDate.toLocaleDateString('en-US', options),
        endDate: newBooking.endDate.toLocaleDateString('en-US', options),
        createdAt: newBooking.createdAt.toLocaleString('en-US', { timeZone }),
        updatedAt: newBooking.updatedAt.toLocaleString('en-US', { timeZone }),
    };
    
    res.json(books);

});
module.exports = router
