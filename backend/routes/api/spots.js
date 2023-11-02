const express = require('express')
const { Spot, Review, User, SpotImage, booking, reviewImages } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { NUMBER } = require('sequelize');
const router = express.Router()




const validateSpot = (req, res, next) => {
    let errors = []

    if (!req.body.address) errors.push("Street address is required")
    if (!req.body.city) errors.push("City is required")
    if (!req.body.state) errors.push("State is required")
    if (!req.body.country) errors.push("Country is required")
    if (!req.body.lat) errors.push("Latitude is not valid")
    if (!req.body.lng) errors.push("Longitude is not valid")
    if (!req.body.name) errors.push("Name must be less than 50 characters")
    if (!req.body.description) errors.push("Description is required")
    if (!req.body.price) errors.push("Price per day is required")

    if (errors.length > 0) {
        const err = new Error('Validation Error')
        err.statusCode = 400
        err.errors = errors
        return next(err)
    }
    next()
}



// * GET ALL SPOTS
router.get('/', async (req, res) => {



    const spots = await Spot.findAll({
        include: [Review, SpotImage],
    })

    let addedSpots = spots.map(async (spot) => {
        let reviews = spot.toJSON().Reviews
        // console.log('hji')
        let starRatings = []
        let reviewArray = []

        reviews.forEach(review => {
            let rating = review.stars
            starRatings.push(rating)
            reviewArray.push(reviews)
        });


        let sum = starRatings.reduce((prevNum, currNum) => prevNum + currNum, 0)
        let averageRating = parseFloat((sum / starRatings.length).toFixed(2))
        spot.avgRating = averageRating


        const spotImage = await SpotImage.findOne({ where: { spotId: spot.id } })
        if (spotImage) {
            spot.previewImage = spotImage.url;
        }
        let revdel = spot.toJSON()
        delete revdel.Reviews
        delete revdel.SpotImages
        return revdel
    });

    addedSpots = await Promise.all(addedSpots)

    res.json({
        "Spots": addedSpots
    })
})



// * GET ALL SPOTS OWNED BY ---CURRENT USER---
router.get("/current", requireAuth, async (req, res) => {
    const currentUserId  = req.user.id
    const spots = await Spot.findAll({
        where: {
            ownerId: currentUserId
        }, include :{model: Review}
    })
    let addsArray = spots.map(spot => {
        let reviews = spot.toJSON().Reviews
        let starRatings = []
        let reviewArray = []

        reviews.forEach(review => {
            let rating = review.stars
            starRatings.push(rating)
            reviewArray.push(reviews)
        });
        let sumRatings = starRatings.reduce((prevNum, currNum) => prevNum + currNum, 0)
        let averageRating = parseFloat((sumRatings/starRatings.length).toFixed(2))
        spot.avgRating = averageRating
        let revdel = spot.toJSON()
        delete revdel.Reviews
        return revdel
    });
    res.status(200).json({"Spots": addsArray})
})


//get details of a Spot from an id---------------------

router.get("/:id", async (req, res) => {
    let spot = await Spot.findByPk(req.params.id)
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

    if (spotImage.length) {
        spot.previewImage = spotImage[0].url
    };

    spot.numReviews = numReviews;
    spot.avgRating = averageRating;
    spot.SpotImages = spotImage,
    spot.Owner = owner

    res.json(spot)
})



//create a Spot

router.post("/", validateSpot, requireAuth, async (req, res) => {
    const ownerId = req.user.id

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

    res.status(201).json(spot)


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
            message: "Validation error",
            statusCode: 400,
        })
    }


    if (preview === true) {
        spot.previewImage = url
        await spot.save() // ask why we are doing this
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


    spot.id = id
    spot.address = address
    spot.city = city
    spot.state = state
    spot.country = country
    spot.lat = lat
    spot.lng = lng
    spot.name = name
    spot.description = description
    spot.price = price


    // let changedSpot = {id: spot.id, ownerId: user.id, address, city, state,
    //         country, lat, lng, name, description, price, createdAt: spot.createdAt,
    //         updatedAt:spot.updatedAt}
    await spot.save()
     res.status(200).json(spot)

})

// delete a Spot
router.delete("/:id", requireAuth, async (req, res) => {
    let spot = await Spot.findByPk(req.params.id)

    if (!spot) {
        res.status(404).json({
            message: "Spot could not be found",
            statusCode: 404
        })
    }

    if (spot.ownerId !== req.user.id) {
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


module.exports = router
