import React, {useCallback, useContext, useEffect, useState} from "react"

import Alert from "@mui/material/Alert"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import {Context} from "services/store"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import PaperContainer from "components/PaperContainer"
import Typography from "@mui/material/Typography"
import api from "services/api"
import useMediaQuery from "@mui/material/useMediaQuery"
import {useTheme} from "@mui/material/styles"

export const LineChoice = () => {
	const {state, dispatch} = useContext(Context)

	const [journeys, setJourneys] = useState([])
	const [loading, setLoading] = useState(false)

	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down("md"))

	const getLines = useCallback(() => {
		setLoading(true)
		api.get(
			`/journey?cur_loc_lon=${state.currentLocation.lon}&cur_loc_lat=${state.currentLocation.lat}&des_loc_lon=${state.destinationLocation.lon}&des_loc_lat=${state.destinationLocation.lat}`
		)
			.then((res) => {
				let journeys = []
				let lineType = []

				res.data.journeys.forEach((journey) => {
					let tmp_journey = {
						walking_time: undefined,
						timezone: undefined,
						section: undefined,
					}
					for (let section of journey.sections) {
						if (section.type === "street_network") {
							tmp_journey.walking_time = section.duration
						} else if (section.type === "public_transport") {
							if (section?.display_informations?.code) {
								if (
									!lineType.includes(
										section.display_informations.code
									)
								) {
									lineType.push(
										section.display_informations.code
									)
									tmp_journey.timezone =
										res.data.context.timezone
									tmp_journey.section = section
								}
							}
							break
						}
					}
					if (tmp_journey.section) journeys.push(tmp_journey)
				})
				setJourneys(journeys)
				setLoading(false)
			})
			.catch((error) => {
				return error
			})
	}, [state.currentLocation, state.destinationLocation])

	useEffect(() => {
		if (
			(state.currentLocation.lat,
			state.currentLocation.lon,
			state.destinationLocation.lat,
			state.destinationLocation.lon)
		) {
			getLines()
		}
	}, [
		getLines,
		state.currentLocation.lat,
		state.currentLocation.lon,
		state.destinationLocation.lat,
		state.destinationLocation.lon,
	])

	return (
		<PaperContainer>
			<>
				<Typography
					variant={isMobile ? "h6" : "h4"}
					component="div"
					gutterBottom
					sx={{px: 2, ...(isMobile && {textAlign: "center"})}}
				>
					<span aria-hidden="true" role="img">
						🚆
					</span>{" "}
					which transportation line do you take first?
				</Typography>

				{loading ? (
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							height: "88%",
						}}
					>
						<CircularProgress disableShrink />
					</Box>
				) : (
					<List sx={{maxHeight: "85%", overflow: "auto"}}>
						{journeys.length > 0 ? (
							<>
								{journeys.map((journey, index) => (
									<ListItem
										key={`journey${index}}`}
										disablePadding
										alignItems="flex-start"
										divider={index < journeys.length - 1}
									>
										<ListItemButton
											onClick={() => {
												dispatch({
													type: "SET_LINE_CHOICE",
													payload: {
														timezone:
															journey.timezone,
														walking_time:
															journey.walking_time,
														stop_area:
															journey.section
																?.from
																?.stop_point
																?.stop_area?.id,
														code: journey.section
															?.display_informations
															?.code,
														direction:
															journey.section
																?.display_informations
																?.direction,
														stop_name: `${journey.section?.display_informations?.physical_mode} ${journey.section?.display_informations?.label} - ${journey.section?.from?.name}`,
													},
												})
												dispatch({
													type: "SET_ACTIVE_STEP",
													payload: 3,
												})
											}}
											sx={{my: 2}}
										>
											<ListItemAvatar sx={{pr: 2}}>
												<Avatar
													sx={{
														bgcolor: `#${
															journey.section
																?.display_informations
																?.color ||
															"808080"
														}`,
														width: 56,
														height: 56,
													}}
												>
													{
														journey.section
															.display_informations
															.label
													}
												</Avatar>
											</ListItemAvatar>
											<ListItemText
												primary={
													<>
														{`${journey.section.display_informations.commercial_mode} ${journey.section.display_informations.code} - ${journey.section.display_informations.direction}`}
													</>
												}
											/>
										</ListItemButton>
									</ListItem>
								))}
							</>
						) : (
							<Alert
								severity="info"
								icon={
									<InfoOutlinedIcon
										fontSize={isMobile ? "medium" : "large"}
									/>
								}
								sx={{
									display: "flex",
									alignItems: "center",
									flexDirection: "column",
									mt: 2,
								}}
							>
								<Typography
									variant={isMobile ? "h6" : "h5"}
									component="div"
									gutterBottom
									align="center"
									sx={{px: isMobile ? 2 : 8}}
								>
									Hm there isn't any transportation right
									now... it might be a good time to breathe
									and rest{" "}
									<span aria-hidden="true" role="img">
										🧘
									</span>
								</Typography>
							</Alert>
						)}
					</List>
				)}
			</>
		</PaperContainer>
	)
}
