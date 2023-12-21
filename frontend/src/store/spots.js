import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = "spots/getAllSpots";
const GET_SPOT_DETAILS = "spots/getSpotDetails";
const CREATE_A_SPOT = "spots/createSpot"
const CREATE_SI = "spot/createSI"
const UPDATE_A_SPOT = "spots/updateSpot"
const DELETE_A_SPOT = "spots/deleteSpot"

// ????????????????????????????????????????????????????? actions

const getAllSpots = (payload) => {
    return {
        type: GET_ALL_SPOTS,
        payload
    }
}

const getSpotDetails = (payload) => {
    return {
        type: GET_SPOT_DETAILS,
        payload
    }
}
const createSpot = (payload) => {
    return {
        type: CREATE_A_SPOT,
        payload
    }
}

const createSI = (payload) => {
    return {
        type: CREATE_SI,
        payload
    }
}

const updateSpot = (payload) => {
    return {
        type: UPDATE_A_SPOT,
        payload
    }
}

const deleteSpot = (payload) => {
    return {
        type: DELETE_A_SPOT,
        payload
    }
}


//***************************************************************  thunks

export const thunkGetAllSpots = () => async (dispatch) => {
    const res = await csrfFetch("/api/spots", {
        method: "GET"
    })
    if(res.ok){
        const allSpots = await res.json()
        dispatch(getAllSpots(allSpots))
        return allSpots
    } else {
        const errorResponse = await res.json()
        return errorResponse
    }
}



export const thunkSpotDetails = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: "GET"
    })
    if(res.ok){
        const spotDetails = await res.json()
        dispatch(getSpotDetails(spotDetails))
        return spotDetails
    } else {
        const errorResponse = await res.json()
        return errorResponse
    }
}




export const thunkCreateSpot = (payload) => async (dispatch) => {
    const res = await csrfFetch("/api/spots", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    if (res.ok) {
        const data = await res.json()
        dispatch(createSpot(data))
        // console.log("spot: ", data)
        return data
    } else {
        const errorResponse = await res.json()
        return errorResponse
    }
}

export const thunkNewSpotImage = (img, spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        body: JSON.stringify(img),
        headers: {"Content-Type": "application/json"}
    })
    if (res.ok) {
        const data = await res.json()
        dispatch(createSI(data))
        return data
    } else {
        const errorResponse = await res.json()
        return errorResponse
    }
}

export const thunkSpotUpdate = (updatedDetails, spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        body: JSON.stringify(updatedDetails),
        headers: { "Content-Type": "application/json"}
    })
    if (res.ok) {
        const data = await res.json()
        dispatch(updateSpot(data))
        return data
    } else {
        const errorResponse = await res.json()
        return errorResponse
    }
}

export const thunkDeleteCurrSpot = (spotId) => async (dispatch) => { //! DELETING FROM HERE WILL NOT DELETE FROM DATABASE
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"}
    })
    if (res.ok) {
        dispatch(deleteSpot(spotId))
    } else {
        const errorResponse = await res.json()
        return errorResponse
    }
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! reducer



const initialState = {
    allSpots: {},
    currSpot: {}
}

export const spotsReducer = (state = initialState, action) => {
    const spotsPostCreation = { ...state.allSpots.Spots }
    switch (action.type) {
        case GET_ALL_SPOTS:
            return { ...state, allSpots: action.payload }
        case GET_SPOT_DETAILS:
            return { ...state, currSpot: action.payload }
        case CREATE_A_SPOT:
            return { ...state, allSpots: spotsPostCreation, currSpot: action.payload }
        case UPDATE_A_SPOT:
            spotsPostCreation[action.payload] = action.payload
            return { ...state, allSpots: spotsPostCreation, currSpot: action.payload }
        case DELETE_A_SPOT:
            delete spotsPostCreation[action.payload]
            return { ...state, allSpots: spotsPostCreation }
        default:
            return state
    }
}

export default spotsReducer
