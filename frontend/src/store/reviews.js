import { csrfFetch } from "./csrf";

const GET_SPOT_REVS = "reviews/getReviews"
const CREATE_REVIEW = "reviews/createReview"
const DELETE_REVIEW = "reviews/deleteReview"


//????????????????????????????????????????? actions


const getReviews = (payload) => {
    return {
        type: GET_SPOT_REVS,
        payload
    }
}

const createReview = (payload) => {
    return {
        type: CREATE_REVIEW,
        payload
    }
}

const deleteReview = (payload) => {
    return {
        type: DELETE_REVIEW,
        payload
    }
}


//*******************************************************************  THUNKZ


export const thunkGetReviews = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "GET"
    })
    if (res.ok) {
        const data = await res.json()
        dispatch(getReviews(data))
        return data
    } else {
        const errorResponse = await res.json()
        return errorResponse
    }
}



export const thunkCreateReview = (review, spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(review)
    })
    if (res.ok) {
        const data = await res.json()
        dispatch(createReview(review, spotId))
        return data
    } else {
        const errorResponse = res.json()
        return errorResponse
    }
}

export const thunkDeleteReview = (reviewId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers : {"Content-Type":"application/json"}
    })
    if (res.ok) {
        dispatch(deleteReview(reviewId))
    } else {
        const errorResponse = await res.json()
        return errorResponse
    }
}


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! reducer



const initialState = {
    spot: {},
    user: {}
}

export const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPOT_REVS:
            return { ...state, spot: action.payload }
        case CREATE_REVIEW:
            return { ...state, [action.payload.id]: action.review }
        case DELETE_REVIEW: {
            const reviews = [...state.spot.Reviews]
            delete reviews[action.spotId]
            const updatedReviews = state.spot.Reviews.filter(review => review.id !== action.payload)
            return { ...state, spot: { Reviews: updatedReviews } }

        }
        default:
            return state
    }
}

export default reviewsReducer
