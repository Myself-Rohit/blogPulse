import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	signInStart,
	signInSuccess,
	signInFailure,
} from "../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";

function SignIn() {
	const [formData, setFormData] = useState({});
	const dispatch = useDispatch();
	const { loading, error: errorMessage } = useSelector((state) => state.user);
	const navigate = useNavigate();

	const handleChange = (e) => {
		dispatch(signInSuccess());
		setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.email || !formData.password) {
			return dispatch(signInFailure("Please fill out all fields."));
		}
		try {
			dispatch(signInStart());
			const res = await fetch("/api/auth/signin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const result = await res.json();

			if (result.success === false) {
				return dispatch(signInFailure(result.message));
			}
			if (res.ok) {
				dispatch(signInSuccess(result));
				navigate("/");
			}
		} catch (error) {
			dispatch(signInFailure(error.message));
		}
	};
	return (
		<div className="min-h-screen mt-20">
			<div className="flex flex-col md:flex-row md:items-center mx-auto max-w-3xl gap-5 p-3">
				<div className="flex-1">
					<Link to={"/"} className=" text-4xl font-bold dark:text-white">
						<span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg">
							Rohit's
						</span>
						Blog
					</Link>
					<p className="text-sm mt-5">
						You can sign in with your email and password or with Google
					</p>
				</div>
				<div className="flex-1">
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						<div>
							<Label value="Your email"></Label>
							<TextInput
								type="email"
								id="email"
								placeholder="example@gmail.com"
								onChange={handleChange}
							/>
						</div>
						<div>
							<Label value="Your password"></Label>
							<TextInput
								type="password"
								id="password"
								placeholder="password"
								onChange={handleChange}
							/>
						</div>

						<Button
							gradientDuoTone="purpleToPink"
							type="submit"
							disabled={loading}
						>
							{loading ? (
								<>
									<Spinner size="sm" />
									<span className="pl-3">Loading...</span>
								</>
							) : (
								"Sign In"
							)}
						</Button>
					</form>
					<div className="flex gap-2 text-sm mt-5">
						<span>Don't have an account?</span>
						<Link to="/signup" className="text-blue-500">
							Sign Up
						</Link>
					</div>
					{errorMessage && (
						<Alert className="mt-5" color="failure">
							{errorMessage}
						</Alert>
					)}
				</div>
			</div>
		</div>
	);
}

export default SignIn;
