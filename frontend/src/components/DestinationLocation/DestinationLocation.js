import React, {useContext} from "react"

import {Context} from "services/store"
import LeafletMap from "components/LeafletMap"
import PaperContainer from "components/PaperContainer"
import PlaceAutocomplete from "components/PlaceAutocomplete"
import Typography from "@mui/material/Typography"
import useMediaQuery from "@mui/material/useMediaQuery"
import {useTheme} from "@mui/material/styles"

export const DestinationLocation = () => {
	const {state} = useContext(Context)

	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down("md"))

	return (
		<PaperContainer>
			<>
				<Typography
					variant={isMobile ? "h6" : "h4"}
					component="div"
					gutterBottom
					sx={isMobile && {textAlign: "center"}}
				>
					<span aria-hidden="true" role="img">
						🔍
					</span>{" "}
					where do you wanna go?
				</Typography>
				<PlaceAutocomplete
					label="Destination"
					dispatchType="SET_DESTINATION_LOCATION"
				/>
				{state?.destinationLocation?.lat &&
					state?.destinationLocation?.lon && (
						<LeafletMap
							dispatchType="SET_DESTINATION_LOCATION"
							locationType="destinationLocation"
							mapHeight="78%"
						/>
					)}
			</>
		</PaperContainer>
	)
}
