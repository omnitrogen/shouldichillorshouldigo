import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react"

import Autocomplete from "@mui/material/Autocomplete"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import {Context} from "services/store"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded"
import TextField from "@mui/material/TextField"
import api from "services/api"
import debounce from "lodash/debounce"
import useMediaQuery from "@mui/material/useMediaQuery"
import {useTheme} from "@mui/material/styles"

export const PlaceAutocomplete = (props) => {
	const {dispatch} = useContext(Context)

	const [inputValue, setInputValue] = useState(undefined)
	const [destinationValue, setDestinationValue] = useState(undefined)
	const [destinationOptions, setDestinationOptions] = useState([])
	const [displayLocationPermission, setDisplayLocationPermission] =
		useState(false)

	const theme = useTheme()
	const fullScreenDialog = useMediaQuery(theme.breakpoints.down("sm"))
	const isMobile = useMediaQuery(theme.breakpoints.down("md"))

	const fetch = useMemo(
		() =>
			debounce((request, callback) => {
				api.get(
					`/places/${request.inputValue.trim().split(" ").join("+")}`
				)
					.then((res) => callback(res.data))
					.catch((error) => {
						return error
					})
			}, 500),
		[]
	)

	useEffect(() => {
		setDestinationOptions([])
		if (inputValue && inputValue !== destinationValue) {
			fetch({inputValue}, (results) => {
				setDestinationOptions(results)
			})
		}
	}, [inputValue, destinationValue, fetch])

	const getLocation = useCallback(() => {
		if ("geolocation" in navigator) {
			setDisplayLocationPermission(true)
			navigator.geolocation.getCurrentPosition(
				(position) => {
					dispatch({
						type: "SET_CURRENT_LOCATION",
						payload: {
							lat: position.coords.latitude.toString(),
							lon: position.coords.longitude.toString(),
						},
					})
					setDisplayLocationPermission(false)
				},
				() => {
					console.log("Unable to retrieve your location")
					setDisplayLocationPermission(false)
				}
			)
		} else {
			console.log("Geolocation is not supported by your browser")
			setDisplayLocationPermission(false)
		}
	}, [dispatch])

	return (
		<>
			<Dialog
				fullScreen={fullScreenDialog}
				open={displayLocationPermission}
				aria-labelledby="responsive-dialog-title"
			>
				<DialogContent>
					<DialogContentText align="center">
						Please allow the app to access your location{" "}
						<span aria-hidden="true" role="img">
							📍
						</span>
					</DialogContentText>
				</DialogContent>
			</Dialog>
			<Box sx={{display: "flex", alignItems: "center"}}>
				<Autocomplete
					id={props.label}
					autoComplete
					size="medium"
					filterOptions={(x) => x}
					options={destinationOptions}
					value={destinationValue}
					getOptionLabel={(option) =>
						option?.display_name || option?.namedetails?.name
					}
					onChange={(event, newValue) => {
						if (
							newValue?.lat &&
							newValue?.lon &&
							newValue?.display_name
						) {
							dispatch({
								type: props.dispatchType,
								payload: {
									lat: newValue.lat,
									lon: newValue.lon,
								},
							})
							setDestinationValue(newValue.display_name)
						}
					}}
					onInputChange={(event, newInputValue) => {
						setInputValue(newInputValue)
					}}
					renderInput={(params) => (
						<TextField {...params} label={props.label} fullWidth />
					)}
					renderOption={(props, option) => (
						<li {...props}>
							<Grid container alignItems="center">
								<Grid item mr={2}>
									{option?.icon ? (
										<Avatar
											alt={`${option.place_id}`}
											src={option.icon}
											sx={{width: 28, height: 28}}
										/>
									) : (
										<Avatar sx={{width: 28, height: 28}}>
											{option?.display_name[0].toLocaleUpperCase()}
										</Avatar>
									)}
								</Grid>
								<Grid item xs>
									{[
										...(option?.display_name
											? [option?.display_name]
											: [
													option?.namedetails?.name,
													option?.address?.city,
													option?.address?.county,
													option?.address?.state,
											  ]),
									]
										.filter((x) => x)
										.join(" - ")}
								</Grid>
							</Grid>
						</li>
					)}
					sx={{
						flex: 1,
						m: isMobile ? 0 : 2,
						...(isMobile && {my: 0.5, mx: 0.5}),
					}}
				/>
				{props.getCurrentLoc && (
					<IconButton
						aria-label="get-location"
						sx={{
							...(props.getCurrentLoc &&
								(isMobile ? {p: 0.5, m: 0.5} : {p: 1, m: 1})),
						}}
						onClick={getLocation}
					>
						<MyLocationRoundedIcon />
					</IconButton>
				)}
			</Box>
		</>
	)
}
