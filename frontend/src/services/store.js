import React, {createContext, useEffect, useReducer, useRef} from "react"

import {initialState} from "./initialState"
import reducer from "./reducer"

export const Store = ({children}) => {
	const [state, dispatch] = useReducer(
		reducer,
		JSON.parse(localStorage.getItem("state")) || initialState
	)
	const initialRenderState = useRef(true)

	useEffect(() => {
		if (initialRenderState.current) {
			initialRenderState.current = false
			return
		}

		localStorage.setItem("state", JSON.stringify(state))
	}, [state])

	return (
		<Context.Provider value={{state, dispatch}}>
			{children}
		</Context.Provider>
	)
}

export const Context = createContext()
