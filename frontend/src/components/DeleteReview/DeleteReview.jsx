import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useEffect } from "react";
import { thunkDeleteReview, thunkGetReviews } from "../../store/reviews";
import { thunkSpotDetails } from "../../store/spots";
import './DeleteReview.css'


export default function DeleteReview({spot, review}){
    const dispatch = useDispatch()

    const {closeModal} = useModal()


    // do the actual think w the thunk

    useEffect(() =>{
        dispatch(thunkGetReviews(spot.id))
    }, [dispatch,spot])

    function deleteRev(){
        dispatch(thunkDeleteReview(review.id))

        dispatch(thunkSpotDetails(spot.id))
        closeModal()
    }

    function cancel(){
        closeModal()
    }

    if(!review) return null


    return(
        <div  className="deleteCont">
            <h2 className="confirmDelete">Confirm</h2>
            <p className="confirmation">Are you sure you want to delete this review?</p>
            <button className="deleteReview" onClick={deleteRev}>Yes (Delete Review)</button>
            <button className="cancel" onClick={cancel}>No</button>
        </div>
    )
}
