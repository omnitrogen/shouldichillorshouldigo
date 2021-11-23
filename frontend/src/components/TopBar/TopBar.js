import React, {useState} from "react"

import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import CenterDivider from "components/CenterDivider"
import CloseIcon from "@mui/icons-material/Close"
import CodeRoundedIcon from "@mui/icons-material/CodeRounded"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Fade from "@mui/material/Fade"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import InfoOutlined from "@mui/icons-material/InfoOutlined"
import Link from "@mui/material/Link"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import nyan from "assets/nyan.gif"
import useMediaQuery from "@mui/material/useMediaQuery"
import {useTheme} from "@mui/material/styles"

export const TopBar = () => {
	const [showDialog, setShowDialog] = useState(false)

	const theme = useTheme()
	const fullScreenDialog = useMediaQuery(theme.breakpoints.down("sm"))
	const isMobile = useMediaQuery(theme.breakpoints.down("md"))

	const handleDialog = () => setShowDialog(!showDialog)

	return (
		<>
			<AppBar position="static">
				<Toolbar>
					<Typography
						variant={isMobile ? "h6" : "h4"}
						component="div"
						sx={{flexGrow: 1, fontWeight: 600}}
					>
						should I chill or should I go?
					</Typography>
					<IconButton
						onClick={handleDialog}
						size="large"
						edge="end"
						color="inherit"
						aria-label="info"
					>
						<InfoOutlined />
					</IconButton>
				</Toolbar>
			</AppBar>
			<Dialog
				fullScreen={fullScreenDialog}
				open={showDialog}
				onClose={handleDialog}
				TransitionComponent={Fade}
				aria-labelledby="responsive-dialog-title"
			>
				{fullScreenDialog && (
					<Grid container justifyContent="flex-end" p={3} pt={1}>
						<IconButton
							edge="end"
							color="inherit"
							onClick={handleDialog}
							aria-label="close dialog"
						>
							<CloseIcon />
						</IconButton>
					</Grid>
				)}
				<DialogTitle id="responsive-dialog-title" align="center">
					What is that all about?
				</DialogTitle>
				<DialogContent>
					<DialogContentText align="center">
						Do you want to know whether or not you have a few
						minutes to <b>chill</b> before walking to your favorite
						transportation station ?
					</DialogContentText>
					<DialogContentText align="center" mt={2}>
						I do, and that's why I created{" "}
						<i>should I chill or should I go!</i>{" "}
						<span aria-hidden="true" role="img">
							🎉
						</span>
					</DialogContentText>
					<DialogContentText align="center" fontSize=".8rem" mt={2}>
						It hasn't been tested extensively, it was created as a
						small project to play with React, Rust, Browser APIs,
						Maps and transportation APIs.
					</DialogContentText>
					<CenterDivider />
					<DialogContentText align="center">
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<CodeRoundedIcon sx={{mr: 0.5}} /> with{" "}
							<Box aria-hidden="true" role="img" sx={{ml: 0.5}}>
								❤️
							</Box>
						</Box>
						<Box>
							by Félix{" "}
							<Link
								sx={{textDecoration: "none"}}
								href="https://twitter.com/omnitrogen"
							>
								@omnitrogen
							</Link>{" "}
							Defrance
						</Box>
						<img
							style={{height: "80px", width: "80px"}}
							src={nyan}
							alt="nyan caaaaaaaat"
						/>
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</>
	)
}
