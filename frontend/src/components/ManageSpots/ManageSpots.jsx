// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { thunkGetAllSpots } from "../../store/spots";
// import { NavLink } from "react-router-dom";
// import OpenModalButton from "../OpenModalButton/OpenModalButton";
// import DeleteSpot from "../DeleteSpot/DeleteSpot";
// import './ManageSpots.css'


// export default function ManageSpots(){

//     const dispatch = useDispatch()

//     const spots = useSelector((state) => state.spots.allSpots.Spots)

//     console.log(spots)

//     if(!spots){
//         dispatch(thunkGetAllSpots())
//         return null
//     }

//     useEffect(() =>{
//         dispatch(thunkGetAllSpots())
//     }, dispatch)
// }
