import {initialState} from "./initialState"

const reducer = (state, action) => {
	switch (action.type) {
		case "SET_CURRENT_LOCATION":
			return {
				...state,
				currentLocation: {
					lat: action.payload.lat,
					lon: action.payload.lon,
				},
			}
		case "SET_DESTINATION_LOCATION":
			return {
				...state,
				destinationLocation: {
					lat: action.payload.lat,
					lon: action.payload.lon,
				},
			}
		case "SET_ACTIVE_STEP":
			return {
				...state,
				activeStep: action.payload,
			}
		case "SET_LINE_CHOICE":
			return {
				...state,
				lineChoice: {
					timezone: action.payload.timezone,
					walking_time: action.payload.walking_time,
					stop_area: action.payload.stop_area,
					code: action.payload.code,
					direction: action.payload.direction,
					stop_name: action.payload.stop_name,
				},
			}
		case "PURGE_STATE":
			return initialState
		default:
			return state
	}
}

export default reducer
