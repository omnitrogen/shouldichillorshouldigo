import Paper from "@mui/material/Paper"
import React from "react"
import useMediaQuery from "@mui/material/useMediaQuery"
import {useTheme} from "@mui/material/styles"

export const PaperContainer = ({children}) => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down("md"))

	return (
		<Paper
			elevation={isMobile ? 0 : 4}
			sx={{
				...(!isMobile
					? {
							borderRadius: 2,
							p: 2,
							height: "70vh",
							width: "60vw",
							":hover": {
								boxShadow: 8,
							},
					  }
					: {
							height: "70vh",
							width: "100vw",
					  }),
			}}
		>
			{children}
		</Paper>
	)
}
