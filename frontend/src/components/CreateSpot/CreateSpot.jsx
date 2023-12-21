// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";


// export default function CreateSpot(){
//     const dispatch = useDispatch()

//     const user = useSelector((state) => state.session.user)

//     console.log(user)

//     const [address, setAddress] = useState('')
//     const [city, setCity] = useState('')
//     const [state, setState] = useState('')
//     const [country, setCountry] = useState('')
//     const [lat, setLat] = useState(0)
//     const [lng, setLng] = useState(0)
//     const [description, setDescription] = useState('')
//     const [name, setName] = useState('')
//     const [price, setPrice] = useState('')
//     const [prevImg, setPrevImg] = useState('')
//     const [ errors, setErrors ] = useState([])

//     const errSetArr = []

//     function validator(){
//         if (!address) errSetArr.push("Address is required")
//         if (!city) errSetArr.push("City is required")
//         if (!state) errSetArr.push("State is required")
//         if (!country) errSetArr.push("Country is required")
//         if (lat < -90 || lat > 90 || !lat) errSetArr.push("Valid Latitude is required")
//         if (lng < -180 || lng > 180 || !lat) errSetArr.push("Valid Longitude is required")
//         if (description.length < 30) errSetArr.push("Description must be at least 30 characters")
//         if (!name) errSetArr.push("Title is required")
//         if (!price) errSetArr.push("Price is required")
//         if (!prevImg) errSetArr.push("Preview image is required")

//         setErrors(errSetArr)
//     }

//     function submitHandler(e){
//         e.preventDefault()

//         const spot = {
//             ownerId: user.id,
//             address,
//             city,
//             state,
//             country,
//             lat,
//             lng,
//             description,
//             name,
//             price
//         }

//         console.log('spot: ', spot )

//         const prev = {
//             url: prevImg,
//             preview: true
//         }


//     }
// }
