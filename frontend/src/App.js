import ReactMapGL, { Marker, Popup } from "react-map-gl";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";

function App() {
	const currentUser = "Hoang";
	const [pins, setPins] = useState([]);
	const [currentPlaceId, setCurrentPlaceId] = useState(null);
	useEffect(() => {
		const getPins = async () => {
			try {
				const res = await axios.get("/pins");
				setPins(res.data);
			} catch (err) {
				console.log(err);
			}
		};
		getPins();
	}, []);

	const handleMarkerClick = (id) => {
		setCurrentPlaceId(id);
	};

	return (
		<div className="App">
			<ReactMapGL
				initialViewState={{
					longitude: -122.4443,
					latitude: 47.2529,
					zoom: 10,
				}}
				mapboxAccessToken={process.env.REACT_APP_MAPBOX}
				style={{ width: "100vw", height: "100vh" }}
				mapStyle="mapbox://styles/mapbox/streets-v11"
			>
				{pins &&
					pins.map((p) => (
						<>
							<Marker longitude={p.long} latitude={p.lat}>
								<LocationOnIcon
									style={{
										color: p.username === currentUser ? "#D44A27" : "purple",
										cursor: "pointer",
									}}
									onClick={() => handleMarkerClick(p._id)}
								/>
							</Marker>
							{p._id === currentPlaceId && (
								<Popup
									longitude={p.long}
									latitude={p.lat}
									anchor="left"
									closeButton={true}
									closeOnClick={false}
									onClose={() => setCurrentPlaceId(null)}
								>
									<div className="card">
										<label>Place</label>
										<h4 className="place">{p.title}</h4>
										<label>Review</label>
										<p className="desc">{p.desc}</p>
										<label>Rating</label>
										<div className="stars">
											<StarIcon className="star" />
											<StarIcon className="star" />
											<StarIcon className="star" />
											<StarIcon className="star" />
											<StarIcon className="star" />
										</div>
										<label>Information</label>
										<span className="username">
											Created by <b>{p.username}</b>
										</span>
										<span className="date">{format(p.createdAt)}</span>
									</div>
								</Popup>
							)}
						</>
					))}
			</ReactMapGL>
		</div>
	);
}

export default App;
