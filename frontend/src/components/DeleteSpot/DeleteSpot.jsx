import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteCurrSpot } from "../../store/spots";
import './DeleteSpot.css'





function DeleteSpot({ spot }) {
    const dispatch = useDispatch()
    const { closeModal } = useModal()
    const [spotExists, setSpotExists] = useState(true)

    const delSpot = (e) => {
        e.preventDefault()
        dispatch(thunkDeleteCurrSpot(spot.id))
        closeModal()
        setSpotExists(false)
    }

    const cancelDel = (e) => {
        e.preventDefault()
        closeModal()
    }

    return (
        <div>
            {spotExists && (
                <div>
                    <h2>Confirm Delete</h2>
                    <p>Are you sure you want to remove this spot?</p>
                    <button onClick={delSpot}>Yes (Delete Spot)</button>
                    <button onClick={cancelDel}>No (Keep Spot)</button>
                </div>
            )}
        </div>
    )
}

export default DeleteSpot
