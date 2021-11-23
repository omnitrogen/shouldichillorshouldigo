import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import React from "react"

export const CenterDivider = () => (
	<Box sx={{display: "flex", justifyContent: "center"}} mt={2} mb={2}>
		<Divider variant="middle" sx={{width: "6rem"}} />
	</Box>
)
