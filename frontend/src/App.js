import ReactMapGL, { Marker, Popup } from "react-map-gl";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
	const myStorage = window.localStorage;
	const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
	const [pins, setPins] = useState([]);
	const [currentPlaceId, setCurrentPlaceId] = useState(null);
	const [newPlace, setNewPlace] = useState(null);
	const [title, setTitle] = useState(null);
	const [desc, setDesc] = useState(null);
	const [rating, setRating] = useState(0);
	const [showRegister, setShowRegister] = useState(false);
	const [showLogin, setShowLogin] = useState(false);
	const [viewport, setViewport] = useState({
		latitude: 47.2529,
		longitude: -122.4443,
		zoom: 10,
	});
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

	const handleMarkerClick = (id, newlat, newlong) => {
		setCurrentPlaceId(id);
		setViewport({ ...viewport, latitude: newlat, longitude: newlong });
	};

	const handleAddClick = (e) => {
		if (!currentUser) {
			alert("Please login first");
		} else {
			const { lat, lng } = e.lngLat;
			setNewPlace({
				lat: lat,
				long: lng,
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newPin = {
			username: currentUser,
			title,
			desc,
			rating,
			lat: newPlace.lat,
			long: newPlace.long,
		};

		try {
			const res = await axios.post("/pins", newPin);
			setPins([...pins, res.data]);
			setNewPlace(null);
		} catch (err) {}
	};

	const handleLogout = () => {
		myStorage.removeItem("user");
		setCurrentUser(null);
	};

	return (
		<div className="App">
			<ReactMapGL
				{...viewport}
				onMove={(evt) => setViewport(evt.viewport)}
				mapboxAccessToken={process.env.REACT_APP_MAPBOX}
				style={{ width: "100vw", height: "100vh" }}
				mapStyle="mapbox://styles/mapbox/streets-v11"
				onDblClick={handleAddClick}
			>
				{pins &&
					pins.map((p) => (
						<>
							<Marker longitude={p.long} latitude={p.lat}>
								<LocationOnIcon
									style={{
										fontSize: "2.5em",
										color: p.username === currentUser ? "#D44A27" : "purple",
										cursor: "pointer",
									}}
									onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
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
											{Array(p.rating).fill(<StarIcon className="star" />)}
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
				{newPlace && (
					<Popup
						longitude={newPlace.long}
						latitude={newPlace.lat}
						anchor="left"
						closeButton={true}
						closeOnClick={false}
						onClose={() => setNewPlace(null)}
					>
						<div>
							<form onSubmit={handleSubmit}>
								<label>Title</label>
								<input
									placeholder="Enter a title"
									onChange={(e) => setTitle(e.target.value)}
								/>
								<label>Review</label>
								<textarea
									placeholder="Say us something about this place"
									onChange={(e) => setDesc(e.target.value)}
								/>
								<label>Rating</label>
								<select onChange={(e) => setRating(e.target.value)}>
									<option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="4">4</option>
									<option value="5">5</option>
								</select>
								<button className="submitButton" type="submit">
									Add Pin
								</button>
							</form>
						</div>
					</Popup>
				)}
				{currentUser ? (
					<button className="button logout" onClick={handleLogout}>
						Log Out
					</button>
				) : (
					<div className="buttons">
						<button className="button login" onClick={() => setShowLogin(true)}>
							Login
						</button>
						<button
							className="button register"
							onClick={() => setShowRegister(true)}
						>
							Register
						</button>
					</div>
				)}
				{showRegister && <Register setShowRegister={setShowRegister} />}
				{showLogin && (
					<Login
						setShowLogin={setShowLogin}
						myStorage={myStorage}
						setCurrentUser={setCurrentUser}
					/>
				)}
			</ReactMapGL>
		</div>
	);
}

export default App;
