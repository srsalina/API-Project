import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkSpotDetails } from "../../store/spots";
import Reviews from "../Reviews";
import './SpotDetails.css'



function SpotDetails() {
    const dispatch = useDispatch()
    const { spotId } = useParams()
    const spot = useSelector((state) => state.spots.currSpot)
    console.log(spot)


    useEffect(() => {
        dispatch(thunkSpotDetails(spotId))
    }, [dispatch, spotId])


    if (!spot) return null
    if (!spot.SpotImages) return null;
    if (spot.id !== parseInt(spotId)) return null;


    function throwAlert(){
        alert("Feature Coming Soon")
    }




    let reviewLabel;
    if (spot.numReviews === 1) reviewLabel = 'Review'
    if (spot.numReviews > 1) reviewLabel = 'Reviews'

    let reviewCount = spot.numReviews

    if (spot.numReviews === 0) reviewCount = ''
    let separator = '•'
    if (!spot.numReviews) separator = ''

    return (
        <div id='spotDetails'>
            <h1 className='spotName'>{spot.name}</h1>
            <div className='location'>{spot.city}, {spot.state}, {spot.country}</div>
            <div className='imgs'>
                <div className='main'> <img src={spot.SpotImages[0].url} className='mainImage' /> </div>
                <div className='extras'>
                    <div className='otherImages'>
                        {spot.SpotImages[1] && <img src={spot.SpotImages[1].url} id='additionalImg' className='extra1' />}
                        {spot.SpotImages[2] && <img src={spot.SpotImages[2].url} id='additionalImg' className='extra2' />}
                    </div>
                    <div className='moreImages'>
                        {spot.SpotImages[3] && <img src={spot.SpotImages[3].url} id='additionalImg' className='extra3' />}
                        {spot.SpotImages[4] && <img src={spot.SpotImages[4].url} id='additionalImg' className='extra4' />}
                    </div>
                </div>
            </div>
            <div className='descriptions'>
                <div className='text-button'>

                    <div className='details'>
                        <h2 className='ownerName'>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
                        <p className='description'>{spot.description}</p>
                    </div>
                    <div className='reserve'>
                        <div className='notButton'>
                            <div className='reservationInfo'>
                                <div className='priceRevs'> ${spot.price} night </div>
                                <div className='reviewInfo'>
                                    < i className='fa-solid fa-star'></i>{typeof spot.avgRating === 'number' ? (<p>{parseFloat(spot.avgRating).toFixed(1)}</p>) : (<p>New</p>)}
                                    <div className='dot'>{separator}</div>
                                    <div className='numRevs'>{reviewCount} {reviewLabel}</div>
                                </div>
                            </div>
                        </div>
                        <button className="reserveButton" onClick={throwAlert}>Reserve</button>
                    </div>
                </div>
            </div>
            <Reviews spotId={spotId} />
        </div>
    )
}


export default SpotDetails
