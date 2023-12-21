import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useModal } from "../../context/Modal"
import { thunkCreateReview, thunkGetReviews } from "../../store/reviews"

import './CreateReview.css'


export default function CreateReview({spot,user}){
    const dispatch = useDispatch()
    const spotId = useSelector((state) => state.spots.currSpot.id)

    const [reviewText, setReviewText] = useState('')
    const [stars, setStars] = useState('')

    const {closeModal } = useModal()


    async function submitHandler(){

        const newReview = {
            userId : user.id,
            spotId: spot.id,
            review: reviewText,
            stars
        }

        const res = dispatch(thunkCreateReview(newReview, spotId))
        dispatch(thunkGetReviews(spotId))

        closeModal()
        // reset reviewText and stars
        setReviewText('')
        console.log(reviewText)
        setStars(0)

        return res
    }

    function setRating(e){
        e.preventDefault()
        setStars(e.target.id)
    }


    return(
        <div className="createReviewContainer">
            <h1 className="revStay">How was your stay?</h1>
            <form onSubmit={submitHandler} className="createForm">

                <textarea
                onChange={(e) => setReviewText(e.target.value)}
                value={reviewText}
                className="reviewText"
                type='text'
                placeholder="Leave your review here..."
                required
                />

                <div className="starBox">
                    <i id="1" className={stars > 0 ? "fa-solid fa-star" : "fa-regular fa-star"} onClick={setRating}></i>
                    <i id="2" className={stars > 1 ? "fa-solid fa-star" : "fa-regular fa-star"} onClick={setRating}></i>
                    <i id="3" className={stars > 2 ? "fa-solid fa-star" : "fa-regular fa-star"} onClick={setRating}></i>
                    <i id="4" className={stars > 3 ? "fa-solid fa-star" : "fa-regular fa-star"} onClick={setRating}></i>
                    <i id="5" className={stars > 4 ? "fa-solid fa-star" : "fa-regular fa-star"} onClick={setRating}></i>
                    <p className="starLabel">Stars</p>
                </div>
                <button className="submitButton" disabled={reviewText.length < 10 || stars < 1}>Submit Review</button>
            </form>
        </div>
    )


}
