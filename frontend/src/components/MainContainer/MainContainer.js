import {isMobileOnly, mobileModel} from "react-device-detect"

import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import MainStepper from "components/MainStepper"
import React from "react"
import TopBar from "components/TopBar"
import Typography from "@mui/material/Typography"
import useOrientationChange from "use-orientation-change"

export const MainContainer = () => {
	const orientation = useOrientationChange()

	return (
		<>
			<TopBar />
			{isMobileOnly && orientation === "landscape" ? (
				<Alert
					severity="info"
					icon={<InfoOutlinedIcon fontSize={"medium"} />}
					sx={{
						display: "flex",
						alignItems: "center",
						flexDirection: "column",
						mt: 2,
					}}
				>
					<Typography
						variant={"h6"}
						component="div"
						gutterBottom
						align="center"
						sx={{px: 2}}
					>
						<>
							Please rotate your {mobileModel}{" "}
							<span aria-hidden="true" role="img">
								😇
							</span>
							<br />
							This website is really{" "}
							<span aria-hidden="true" role="img">
								💩
							</span>{" "}
							in landscape mode
						</>
					</Typography>
				</Alert>
			) : (
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "space-evenly",
						height: "92vh",
					}}
				>
					<MainStepper />
				</Box>
			)}
		</>
	)
}
