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
}
