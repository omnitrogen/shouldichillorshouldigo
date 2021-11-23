import React, {useContext} from "react"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded"
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded"
import {Context} from "services/store"
import CurrentLocation from "components/CurrentLocation"
import DestinationLocation from "components/DestinationLocation"
import LineChoice from "components/LineChoice"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import Stepper from "@mui/material/Stepper"
import Timer from "components/Timer"
import Typography from "@mui/material/Typography"
import {useKeyPressEvent} from "react-use"
import useMediaQuery from "@mui/material/useMediaQuery"
import {useTheme} from "@mui/material/styles"

export const MainStepper = () => {
	const {state, dispatch} = useContext(Context)

	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

	useKeyPressEvent("ArrowRight", () => {
		dispatch({
			type: "SET_ACTIVE_STEP",
			payload: (state.activeStep + 1) % 4,
		})
	})

	useKeyPressEvent("ArrowLeft", () => {
		if (state.activeStep !== 0) {
			dispatch({
				type: "SET_ACTIVE_STEP",
				payload: state.activeStep - 1,
			})
		}
	})

	const stepper = [
		{label: "Start", component: CurrentLocation},
		{label: "End", component: DestinationLocation},
		{label: "Line", component: LineChoice},
		{
			label: (
				<span aria-hidden="true" role="img">
					⏰
				</span>
			),
			component: Timer,
		},
	]

	return (
		<>
			{stepper.map(({component: Component}, index) => {
				return state.activeStep === index && <Component key={index} />
			})}
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "center",
						width: "20vw",
						pt: isMobile ? 2 : 2,
						pb: 2,
					}}
				>
					{state.activeStep === stepper.length - 1 ? (
						<Button
							variant="outlined"
							onClick={() =>
								dispatch({
									type: "SET_ACTIVE_STEP",
									payload: 0,
								})
							}
							sx={{
								ml: 2,
								borderRadius: 3,
								py: 1.6,
								...(isMobile && {
									minWidth: 40,
									width: 40,
									height: 40,
								}),
							}}
							aria-label="restart stepper"
						>
							<RestartAltIcon
								fontSize={isMobile ? "small" : "large"}
							/>
						</Button>
					) : (
						<>
							<Button
								variant="outlined"
								onClick={() =>
									dispatch({
										type: "SET_ACTIVE_STEP",
										payload: state.activeStep - 1,
									})
								}
								disabled={state.activeStep === 0}
								sx={{
									ml: 2,
									borderRadius: 3,
									py: 1.6,
									...(isMobile && {
										minWidth: 40,
										width: 40,
										height: 40,
									}),
								}}
								aria-label="previous step"
							>
								<ChevronLeftRoundedIcon
									fontSize={isMobile ? "small" : "large"}
								/>
							</Button>
							<Button
								variant="outlined"
								onClick={() =>
									dispatch({
										type: "SET_ACTIVE_STEP",
										payload: state.activeStep + 1,
									})
								}
								sx={{
									ml: 2,
									borderRadius: 3,
									py: 1.6,
									...(isMobile && {
										minWidth: 40,
										width: 40,
										height: 40,
									}),
								}}
								aria-label="next step"
							>
								<ChevronRightRoundedIcon
									fontSize={isMobile ? "small" : "large"}
								/>
							</Button>
						</>
					)}
				</Box>
				<Stepper
					activeStep={state.activeStep}
					sx={{
						display: "flex",
						flexDirection: "row",
						...(!isMobile && {width: "50vw"}),
					}}
				>
					{stepper.map((step) => (
						<Step key={step.label}>
							<StepLabel>
								<Typography variant={isMobile ? "body1" : "h5"}>
									{step.label}
								</Typography>
							</StepLabel>
						</Step>
					))}
				</Stepper>
			</Box>
		</>
	)
}
