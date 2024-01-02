import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetReviews } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import CreateReview from "../CreateReview";
import DeleteReview from "../DeleteReview";
import './Reviews.css'






function Reviews({ spotId }) {
    const dispatch = useDispatch()


    const spot = useSelector((state) => state.spots.currSpot)
    const currentReviews = useSelector((state) => state.reviews.spot.Reviews)
    const currentUser = useSelector((state) => state.session.user)


    // console.log("spot: ", spot)
    // console.log("revs: ", currentReviews)
    // console.log("user: ", currentUser)


    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]


    useEffect(() => {
        dispatch(thunkGetReviews(spotId))
    }, [dispatch, spotId])


    if (!spot) return null
    if (!currentReviews) return null
    if (!spot.avgRating) return null


    const reviewOrder = [...currentReviews].sort((review, nextReview) => new Date(nextReview.createdAt) - new Date(review.createdAt)); //! works


    let ownerVerify = false;


    if (spot && spot.Owner && currentUser) {
        let ownerboolie = spot.Owner.id === currentUser.id
        console.log(ownerboolie)
        ownerVerify = ownerboolie
    }


    let reviewAmount = 'Reviews'


    if (currentReviews.length === 1) {
        reviewAmount = 'Review'
    }


    let loggedIn = false
    if (currentUser) loggedIn = true


    let notReviewed = true
    if (currentReviews) {
        for (let currentRev of currentReviews) {
            if (currentUser && currentRev.User.id === currentUser.id) {
                notReviewed = false;
                break
            }
        }
    }




    // console.log(currentReviews)


    //***************************************************  Return if there are no current reviews
    if (!currentReviews.length) {
        return (
            <div className='reviewContainer'>
                <div className='reviewHeader'>
                    <i className="fa-solid fa-star"></i>


                    <p className="reviewLabel">New</p>
                </div>
                {loggedIn && !ownerVerify && notReviewed && (
                    <div className='createReview'>
                        <OpenModalButton
                            className="postBut"
                            buttonText="Post Your Review"
                            modalComponent={<CreateReview spot={spot} user={currentUser} />}
                        />
                    </div>
                )}
                {!ownerVerify && loggedIn && notReviewed && <p className='firstRev'>Be the first to post a review!</p>}
            </div>
        )
    }




    //! else
    return (
        <div className="reviewContainer">
            <i id='reviewStar' className="fa-solid fa-star"></i>
            <div className='reviewHeader'>
                <div className='avgRate'>{spot && spot.avgRating && spot.avgRating.toFixed(1)}</div>
                <div>•</div>
                <div className='reviewsNumber'> {spot.numReviews} </div>
                <div className='reviewAmount'> {reviewAmount}</div>
            </div>
            {loggedIn && !ownerVerify && notReviewed && (
                <OpenModalButton
                    className="postRevButton"
                    buttonText="Post Your Review"
                    modalComponent={<CreateReview spot={spot} user={currentUser} />}
                />
            )}
            <div className='revList'>
                {reviewOrder.map((review) => (
                    <div key={review.id} className='singleReview'>
                        <div className='userDisplay'>{review.User.firstName}</div>
                        <div className='date'>
                            <div className='month'>{months[new Date(review.createdAt).getMonth()]}</div>
                            <div className='year'>{review.createdAt.slice(6, 10)}</div>
                        </div>
                        <div className='reviewText'>{review.review}</div>
                        {currentUser && currentUser.id === review.User.id ? (
                            <div className='deleteRevContainer'>
                                <OpenModalButton
                                    className='deleteButton'
                                    buttonText='Delete Review'
                                    modalComponent={<DeleteReview review={review} spot={spot} />}
                                />
                            </div>
                        ) : null}
                    </div>


                ))
                }
            </div>
        </div>
    )
}


export default Reviews
