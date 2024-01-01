import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteCurrSpot } from "../../store/spots";
import './DeleteSpot.css'





function DeleteSpot({ spot }) {
    const dispatch = useDispatch()
    const { closeModal } = useModal()
    const [spotExists, setSpotExists] = useState(true)

    function spotDelete(e){
        e.preventDefault()
        dispatch(thunkDeleteCurrSpot(spot.id))
        closeModal()
        setSpotExists(false)
    }

    function cancel(e){
        e.preventDefault()
        closeModal()
    }

    return (
        <div>
            {spotExists && (
                <div className="deleteContainer">
                    <h2 className="confirmHeader">Confirm Delete</h2>
                    <p className="confirmationText">Are you sure you want to remove this spot?</p>
                    <button className="deleteButton" onClick={spotDelete}>Yes (Delete Spot)</button>
                    <button className="cancelButton" onClick={cancel}>No (Keep Spot)</button>
                </div>
            )}
        </div>
    )
}

export default DeleteSpot
