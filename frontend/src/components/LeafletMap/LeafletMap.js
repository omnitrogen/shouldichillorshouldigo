import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"

import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet"
import React, {useContext, useEffect, useMemo, useRef} from "react"

import {Context} from "services/store"
import useMediaQuery from "@mui/material/useMediaQuery"
import {useTheme} from "@mui/material/styles"

const MoveOnUpdate = ({locationType}) => {
	const {state} = useContext(Context)

	const map = useMap()

	useEffect(() => {
		map.setView(
			{lat: state[locationType].lat, lng: state[locationType].lon},
			map.getZoom(),
			{
				animate: true,
			}
		)
	}, [locationType, map, state])

	return null
}

const DraggableMarker = ({dispatchType, locationType}) => {
	const {state, dispatch} = useContext(Context)

	const markerRef = useRef(null)

	const map = useMap()

	const eventHandlers = useMemo(
		() => ({
			dragend() {
				const marker = markerRef.current
				if (marker != null) {
					const {lat, lng} = marker.getLatLng()
					map.setView({lat, lng}, map.getZoom(), {
						animate: true,
					})
					dispatch({
						type: dispatchType,
						payload: {
							lat: lat.toString(),
							lon: lng.toString(),
						},
					})
				}
			},
		}),
		[dispatch, dispatchType, map]
	)

	return (
		<Marker
			draggable={true}
			eventHandlers={eventHandlers}
			position={[state[locationType].lat, state[locationType].lon]}
			ref={markerRef}
		>
			<Popup>Drag me!</Popup>
		</Marker>
	)
}

export const LeafletMap = ({dispatchType, locationType, mapHeight}) => {
	const {state} = useContext(Context)

	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down("md"))

	return (
		<MapContainer
			center={[state[locationType].lat, state[locationType].lon]}
			zoom={13}
			scrollWheelZoom={true}
			doubleClickZoom={true}
			attributionControl={false}
			zoomControl={false}
			style={{
				height: mapHeight,
				borderRadius: isMobile ? "0" : "8px",
			}}
		>
			<TileLayer
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			<DraggableMarker
				dispatchType={dispatchType}
				locationType={locationType}
			/>

			<MoveOnUpdate locationType={locationType} />
		</MapContainer>
	)
}
