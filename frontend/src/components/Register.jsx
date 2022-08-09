import "./Register.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CancelIcon from "@mui/icons-material/Cancel";
import { useRef, useState } from "react";
import axios from "axios";

const Register = ({ setShowRegister }) => {
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");
	const nameRef = useRef();
	const emailRef = useRef();
	const passwordRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const username = nameRef.current.value;
		const email = emailRef.current.value;
		const password = passwordRef.current.value;
		//Input validation
		const usernameRegex = /^[a-z][a-z0-9_]{3,20}$/gi;
		const emailRegex = /\S+@\S+\.\S+/;
		const passwordRegex = /^[a-z][a-z0-9_]{4,10}$/gi;
		if (!username || !email || !password) {
			setError("Please input all the input fields");
		} else if (!usernameRegex.test(username)) {
			setError("Please input a valid username");
		} else if (!emailRegex.test(email)) {
			setError("Please input a valid email");
		} else if (!passwordRegex.test(password)) {
			setError("Please input a valid password");
		} else {
			const newUser = {
				username: nameRef.current.value,
				email: emailRef.current.value,
				password: passwordRef.current.value,
			};

			try {
				await axios.post("/users/register", newUser);
				setError("");
				setSuccess(true);
			} catch (err) {
				setSuccess(false);
				setError("Something went wrong");
			}
		}
	};

	return (
		<div className="registerContainer">
			<div className="logo">
				<LocationOnIcon />
				MyTravelPin
			</div>
			<form onSubmit={handleSubmit}>
				<input type="text" placeholder="Username" ref={nameRef} />
				<input type="email" placeholder="Email" ref={emailRef} />
				<input type="password" placeholder="Password" ref={passwordRef} />
				<button className="registerBtn">Register</button>
				{success && (
					<span className="success">Successful. You can log in now!</span>
				)}
				{error && <span className="failure">{error}</span>}
			</form>
			<CancelIcon
				className="registerCancel"
				onClick={() => setShowRegister(false)}
			/>
		</div>
	);
};

export default Register;
