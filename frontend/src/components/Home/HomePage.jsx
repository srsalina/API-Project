import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom"
import { thunkGetAllSpots } from '../../store/spots'
import './HomePage.css'
// import spotsReducer from "../../store/spots";

export default function HomePage(){
    const dispatch = useDispatch()
    const spots = useSelector((state) => state.spots.allSpots.Spots)
    // console.log(spots)
    useEffect(() =>{
        dispatch(thunkGetAllSpots())
    }, [dispatch])


    const homePageContainer = spots?.map((spot) =>(
        <div key={spot?.id} className="spotsContainer">
            <NavLink to={`/spots/${spot?.id}`}>
                <div className='imgContainer'>
                    <div title={spot.name}>
                        <img src={spot.previewImage} className='imagePreview' />
                    </div>
                </div>
                <div className='localPrice'>
                    <p className='location'>{spot.city}, {spot.state}</p>
                    <p className='price'>${spot.price}.00 night</p>
                </div>
                <div className='reviewsSection'>
                    <div className='reviews'>
                        < i className='fa-solid fa-star'></i>{typeof spot.avgRating === 'number' ? (<p>{parseFloat(spot.avgRating).toFixed(1)}</p>) : (<p>New</p>)}
                    </div>
                </div>
            </NavLink >
        </div >
    ))

    return(
        <div className="page">
            <div className="homeLanding">
                {homePageContainer}
            </div>
        </div>
    )
}
