import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom"
import { thunkGetAllSpots } from '../../store/spots'
import './HomePage.css'


export default function HomePage(){
    const dispatch = useDispatch()
    const spots = useSelector((state) => state.spots.allSpots.Spots)

    useEffect(() =>{
        dispatch(thunkGetAllSpots())
    }, [dispatch])


    const homePageContainer = spots?.map((spot) =>{
        <NavLink to={`/spots/${spot?.id}`}>
            <div>

            </div>
        </NavLink>
    })

    return(
        <div>
            <div>
                {homePageContainer}
            </div>
        </div>
    )
}
