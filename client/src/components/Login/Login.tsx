import styles from "./Login.module.scss";
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FaPerson, FaLock } from "react-icons/fa6";
import { type T_USERINPUT_LOGIN, INIT_USERINPUT_LOGIN } from "../../types.ts";
import { useAuthCtx } from "../../contexts/AuthProvider.tsx";
import Locals from "./Locals.ts";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
	const [userInput, setUserInuput] =
		useState<T_USERINPUT_LOGIN>(INIT_USERINPUT_LOGIN);
	const [error, setError] = useState<boolean>(false);
	const [incorrectInfo, setIncorrectInfo] = useState<boolean>(false);

	const auth = useAuthCtx();
	const queryClient = useQueryClient();
	const loginMutation = Locals.useLoginMutation(
		auth,
		queryClient,
		setIncorrectInfo,
	);

	// INPUT HANDLER
	const inputHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
		if (incorrectInfo) setIncorrectInfo(false);

		setUserInuput({
			...userInput,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div className={styles.root}>
			<div className={styles.scroll}>
				<div className={styles.main}>
					<div className={styles.logo}>
						<img src="/favicon.svg" alt="logo" />
					</div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();

							loginMutation.mutate(userInput);
						}}
					>
						<div className={styles.title}>
							<h2>Welcome!</h2>
						</div>
						<div className={styles.input}>
							<div>
								<FaPerson />
							</div>
							<input
								type="text"
								name="username"
								value={userInput.username}
								onChange={inputHandler}
								placeholder="Username"
								autoComplete="on"
								required={true}
							/>
						</div>
						<br />

						<div className={styles.input}>
							<div>
								<FaLock />
							</div>
							<input
								type="password"
								name="password"
								id="passwordBox"
								value={userInput.password}
								onChange={inputHandler}
								placeholder="Password"
								autoComplete="on"
								required={true}
							/>
						</div>

						<Link to={"/password/reset"} className={styles.link}>
							<div className={styles.forgot_password}>Forgot Password?</div>
						</Link>

						{incorrectInfo && (
							<div style={{ color: "red", marginTop: "10px" }}>
								Information was incorrect
							</div>
						)}

						{error && (
							<div>
								<div>Error, Please Try Again</div>
								<br />
							</div>
						)}

						<button type="submit">Login</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
