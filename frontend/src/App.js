import * as React from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";

function App() {
	return (
		<div className="App">
			<ReactMapGL
				initialViewState={{
					longitude: -122.4443,
					latitude: 47.2529,
					zoom: 10,
				}}
				mapboxAccessToken={process.env.REACT_APP_MAPBOX}
				// style={{ width: "100%", height: "100%" }}
				mapStyle="mapbox://styles/mapbox/streets-v11"
			>
				<Marker longitude={-122.4268} latitude={47.2366} draggable>
					<LocationOnIcon />
				</Marker>
			</ReactMapGL>
		</div>
	);
}

export default App;
