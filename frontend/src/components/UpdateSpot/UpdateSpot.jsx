import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkSpotDetails, thunkSpotUpdate } from "../../store/spots";
import './UpdateSpot.css'


export default function UpdateSpot(){
    const dispatch = useDispatch()
    const {spotId} = useParams()
    const spot = useSelector((state) => state.spots.currSpot)
    console.log(spot)

    const [ address, setAddress ] = useState(spot.address)
    const [ city, setCity ] = useState(spot.city)
    const [ state, setState ] = useState(spot.state)
    const [ country, setCountry ] = useState(spot.country)
    const [ lat, setLat ] = useState(spot.lat)
    const [ lng, setLng ] = useState(spot.lng)
    const [ name, setName ] = useState(spot.name)
    const [ description, setDescription ] = useState(spot.description)
    const [ price, setPrice ] = useState(spot.price)
    const [ avgRating, setAvgRating ] = useState(spot.avgRating)
    const [ previewImage, setPreviewImage ] = useState(spot.previewImage)


    useEffect(() => {
        dispatch(thunkSpotDetails(spotId))
    }, [dispatch,spotId])


}
