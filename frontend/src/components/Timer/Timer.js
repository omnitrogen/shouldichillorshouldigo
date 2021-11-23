import {DateTime, Duration, Interval} from "luxon"
import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react"

import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import {Context} from "services/store"
import {CountdownCircleTimer} from "react-countdown-circle-timer"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import PaperContainer from "components/PaperContainer"
import Typography from "@mui/material/Typography"
import api from "services/api"
import run from "assets/run.gif"
import useMediaQuery from "@mui/material/useMediaQuery"
import {useTheme} from "@mui/material/styles"

const colorSign = (x) => (x < 0 ? 0 : 1)

export const Timer = () => {
	const {state} = useContext(Context)

	const [departureTimes, setDepartureTimes] = useState([])
	const [loading, setLoading] = useState(false)

	const timesUp = useRef(false)

	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down("md"))

	let nbMin =
		Duration.fromObject({
			minutes: 0,
			seconds: state.lineChoice.walking_time,
		})
			.normalize()
			.toObject().minutes + 1

	const get_schedule = useCallback(() => {
		setLoading(true)
		api.get(
			`/departures?stop_area=${state.lineChoice.stop_area}&cur_loc_lon=${state.currentLocation.lon}&cur_loc_lat=${state.currentLocation.lat}`
		)
			.then((res) => {
				let departures = res.data.departures.filter(
					(departure) =>
						departure.display_informations.code ===
							state.lineChoice.code &&
						departure.display_informations.direction ===
							state.lineChoice.direction
				)
				let now = DateTime.now().setZone(state.lineChoice.timezone)
				setDepartureTimes(
					departures.flatMap((departure) => {
						let departure_time = DateTime.fromISO(
							departure.stop_date_time.departure_date_time
						)
						let interval =
							Interval.fromDateTimes(now, departure_time)
								.toDuration()
								.as("seconds") - state.lineChoice.walking_time
						return isNaN(interval) || interval < 0 ? [] : interval
					})
				)
				setLoading(false)
			})
			.catch((error) => {
				return error
			})
	}, [
		state.currentLocation,
		state.lineChoice.stop_area,
		state.lineChoice.code,
		state.lineChoice.direction,
		state.lineChoice.timezone,
		state.lineChoice.walking_time,
	])

	const timesUpCallback = useCallback(() => {
		timesUp.current = false

		let timer = setTimeout(() => {
			get_schedule()
			clearTimeout(timer)
		}, 60000)
	}, [get_schedule])

	useEffect(() => {
		get_schedule()
	}, [get_schedule])

	const CountdownTimer = (props) => {
		let first_color = ((x) => colorSign(x - 300) * (1 - 300 / x))(
			props.duration
		)
		let second_color = ((x) =>
			colorSign(x - 120) * (1 - first_color - 120 / x))(props.duration)
		let third_color = 1 - (first_color + second_color)

		return (
			<CountdownCircleTimer
				isPlaying
				duration={props.duration}
				colors={[
					[theme.palette.primary.main, first_color],
					["#f0932b", second_color],
					["#eb4d4b", third_color],
				]}
				size={props.size}
				strokeWidth={props.strokeWidth}
			>
				{({remainingTime}) => renderTime({remainingTime, ...props})}
			</CountdownCircleTimer>
		)
	}

	const renderTime = ({remainingTime, fontSize, type}) => {
		if (remainingTime === 0) {
			if (!timesUp.current) {
				console.log("timesUp")
				timesUp.current = true
				timesUpCallback()
			}
			return (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					{type === "main" ? (
						<Typography
							variant={isMobile ? "caption" : "body1"}
							gutterBottom
						>
							RUUUUN
						</Typography>
					) : (
						<></>
					)}
					<img
						style={{
							height: isMobile ? "40px" : "80px",
							width: isMobile ? "40px" : "80px",
						}}
						src={run}
						alt="ruuuuuuun"
					/>
				</div>
			)
		}
		let display_time = Math.floor(remainingTime / 60) + 1

		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<div
					style={{
						fontSize: fontSize.text,
						fontFamily: theme.typography.fontFamily,
					}}
				>
					{display_time}
				</div>
				<div
					style={{
						color: "#aaa",
						fontSize: fontSize.subtext,
					}}
				>
					{display_time !== 1 ? (
						<Typography variant="body1">minutes</Typography>
					) : (
						<Typography variant="body1">minute</Typography>
					)}
				</div>
			</div>
		)
	}

	return (
		<PaperContainer>
			<>
				<Typography
					variant={isMobile ? "h6" : "h4"}
					component="div"
					gutterBottom
					sx={{px: 2, textAlign: "center"}}
				>
					<span aria-hidden="true" role="img">
						⏰
					</span>{" "}
					to catch your transportation, leave at last in
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
					<Box
						sx={{
							height: "88%",
							overflow: "auto",
						}}
					>
						{departureTimes[0] ? (
							<Box
								sx={{
									height: "100%",
									display: "flex",
									flexDirection: "column",
									justifyContent: isMobile
										? "inherit"
										: "space-evenly",
								}}
							>
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									}}
								>
									<CountdownTimer
										duration={departureTimes[0]}
										size={isMobile ? 130 : 180}
										strokeWidth={isMobile ? 8 : 12}
										fontSize={{
											text: "46px",
											subtext: "20px",
										}}
										onComplete={[false, 0]}
										type="main"
									/>
									{departureTimes[1] && (
										<>
											<Typography
												variant={
													isMobile ? "body2" : "body1"
												}
												component="div"
												gutterBottom
												align="center"
												sx={{my: 3}}
											>
												or wait for another:
											</Typography>
											<div
												style={{
													display: "flex",
													justifyContent: "center",
												}}
											>
												<CountdownTimer
													duration={departureTimes[1]}
													size={isMobile ? 100 : 120}
													strokeWidth={
														isMobile ? 4 : 8
													}
													fontSize={{
														text: "26px",
														subtext: "12px",
													}}
													onComplete={[false, 0]}
													type="secondary"
												/>
											</div>
										</>
									)}
								</Box>
								<Alert
									severity="info"
									icon={
										<InfoOutlinedIcon
											fontSize={
												isMobile ? "medium" : "large"
											}
										/>
									}
									sx={{
										display: "flex",
										alignItems: "center",
										flexDirection: isMobile
											? "column"
											: "row",
										mt: 2,
									}}
								>
									<Typography
										variant={isMobile ? "body2" : "body1"}
										component="div"
										gutterBottom
										align="center"
										sx={{px: isMobile ? 2 : 8}}
									>
										This is computed considering that the
										walking time between your place and the{" "}
										<i>{state.lineChoice.stop_name}</i>{" "}
										station is approximately{" "}
										<b>
											{nbMin} minute{nbMin > 1 ? "s" : ""}
											.
										</b>
									</Typography>
								</Alert>
							</Box>
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
									{state.lineChoice?.stop_name ? (
										"No departure any time soon..."
									) : (
										<>
											Nope there is still nothing here...
											Seriously you should rest{" "}
											<span aria-hidden="true" role="img">
												😴
											</span>
										</>
									)}
								</Typography>
							</Alert>
						)}
					</Box>
				)}
			</>
		</PaperContainer>
	)
}
