import "leaflet/dist/leaflet.css"
import "index.css"

import {ThemeProvider, createTheme} from "@mui/material/styles"

import MainContainer from "components/MainContainer"
import React from "react"
import {Store} from "services/store"

const theme = createTheme({
	palette: {
		primary: {
			main: "#7d4cdb",
		},
	},
	typography: {
		fontFamily: "Nunito",
	},
})

export const App = () => {
	return (
		<Store>
			<ThemeProvider theme={theme}>
				<MainContainer />
			</ThemeProvider>
		</Store>
	)
}
