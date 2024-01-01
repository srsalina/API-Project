import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteSpot from "../DeleteSpot/DeleteSpot";
import "./ManageSpots.css";

export default function ManageSpots() {
  const dispatch = useDispatch();

  const spots = useSelector((state) => state.spots.allSpots.Spots);
  const user = useSelector((state) => state.session.user);
  console.log('spots: ',spots)


  useEffect(() => {
      if (!spots) {
        dispatch(thunkGetAllSpots());
        return null;
      }
    dispatch(thunkGetAllSpots());
  }, [dispatch,spots]);

  const userSpots = spots.filter((spot) => spot.ownerId === user.id);

//   console.log(userSpots);

  const spotsDisplay = userSpots?.map((spot) => (
    <div key={spot?.id} className="spotsContainer">
      <NavLink to={`/spots/${spot.id}`}>
        <div className="imgContainer">
          <div className="toolTip" title={spot.name}>
            <img src={spot.previewImage} className="previewImg" />
          </div>
        </div>
        <div className="locationPrice">
          <p className="location">
            {spot.city}, {spot.state}
          </p>
          <p className="price">${spot.price}.00 night</p>
        </div>
        <div className="reviewSection">
          <div className="reviews">
            <i className="fa-solid fa-star"></i>
            {typeof spot.avgRating === "number" ? (
              <p>{parseFloat(spot.avgRating).toFixed(1)}</p>
            ) : (
              <p>New</p>
            )}
          </div>
        </div>
      </NavLink>
      <div className="updateDelete">
        <button className="updateSpot">
          <NavLink to={`/spots/${spot.id}/edit`} className="updateNav">
            Update
          </NavLink>
        </button>
        <div className="deleteButton">
          <OpenModalButton
            buttonText={"Delete"}
            modalComponent={<DeleteSpot spot={spot} />}
          />
        </div>
      </div>
    </div>
  ));

  return (
    <div className="manageBox">
      <div className="createHeader">
        <h1 className="manageHeader">Manage Spots</h1>
        <NavLink to="/spots/new" className="spotManage">
          Create A Spot
        </NavLink>
      </div>
      <div className="return">
        <div className="manage">{spotsDisplay}</div>
      </div>
    </div>
  );
}
