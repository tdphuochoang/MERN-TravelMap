import "./Login.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CancelIcon from "@mui/icons-material/Cancel";
import { useRef, useState } from "react";
import axios from "axios";

const Login = ({ setShowLogin, myStorage, setCurrentUser }) => {
	const [error, setError] = useState("");
	const nameRef = useRef();
	const passwordRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const username = nameRef.current.value;
		const password = passwordRef.current.value;
		//Input validation
		const usernameRegex = /^[a-z][a-z0-9_]{3,20}$/gi;
		const passwordRegex = /^[a-z][a-z0-9_]{4,10}$/gi;
		if (!username || !password) {
			setError("Please input all the input fields");
		} else if (!usernameRegex.test(username)) {
			setError("Please input a valid username");
		} else if (!passwordRegex.test(password)) {
			setError("Please input a valid password");
		} else {
			const user = {
				username: nameRef.current.value,
				password: passwordRef.current.value,
			};

			console.log(user);

			try {
				const res = await axios.post("/users/login", user);
				myStorage.setItem("user", res.data.username);
				setCurrentUser(res.data.username);
				setShowLogin(false);
				setError("");
			} catch (err) {
				console.log(err);
				setError("Something went wrong");
			}
		}
	};

	return (
		<div className="loginContainer">
			<div className="logo">
				<LocationOnIcon />
				MyTravelPin
			</div>
			<form onSubmit={handleSubmit}>
				<input type="text" placeholder="Username" ref={nameRef} />
				<input type="password" placeholder="Password" ref={passwordRef} />
				<button className="loginBtn">Login</button>
				{error && <span className="failure">{error}</span>}
			</form>
			<CancelIcon className="loginCancel" onClick={() => setShowLogin(false)} />
		</div>
	);
};

export default Login;
