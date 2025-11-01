import { useQueryClient } from "@tanstack/react-query";
import styles from "./PasswordReset.module.scss";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Locals, { E_DISPLAY_STATE } from "./Locals";
import { useAuthCtx } from "../../../../contexts/AuthProvider";

const PasswordReset: React.FC = () => {
	const [code, setCode] = useState<string>("");
	const [displayState, setDisplayState] = useState<E_DISPLAY_STATE>(
		E_DISPLAY_STATE.INIT,
	);
	const [error, setError] = useState<string>("");

	const authCtx = useAuthCtx();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const codeSearchMutation = Locals.useCodeSearchMutation(
		setDisplayState,
		setError,
		setCode,
	);
	const passwordUpdateMutation = Locals.usePasswordUpdateMutation(
		queryClient,
		authCtx,
		navigate,
		setError,
	);
	const codeForm = Locals.useCodeForm(setCode, codeSearchMutation);

	const passwordForm = Locals.usePasswordForm(
		code,
		passwordUpdateMutation,
		setError,
	);

	return (
		<div className={styles.root}>
			{displayState === E_DISPLAY_STATE.INIT && (
				<form
					className={styles.init}
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						codeForm.handleSubmit();
					}}
				>
					<codeForm.Field
						name="username"
						children={(field) => (
							<>
								<h2>Username</h2>
								<input
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className={
										field.state.meta.errors.length > 0 ? styles.err : ""
									}
									type="text"
								/>
								{field.state.meta.errors ? (
									<div className={styles.err}>
										{field.state.meta.errors.join(", ")}
									</div>
								) : null}
							</>
						)}
						validators={{
							onSubmit: ({ value }) => {
								return value === "" ? "Cannot be empty" : undefined;
							},
						}}
					/>

					<codeForm.Field
						name="code"
						children={(field) => (
							<>
								<h2>Reset Code</h2>
								<input
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className={
										field.state.meta.errors.length > 0 ? styles.err : ""
									}
									type="text"
								/>
								{field.state.meta.errors ? (
									<div className={styles.err}>
										{field.state.meta.errors.join(", ")}
									</div>
								) : null}
							</>
						)}
						validators={{
							onSubmit: ({ value }) => {
								return value === "" ? "Cannot be empty" : undefined;
							},
						}}
					/>

					{error && <div className={styles.err}>{error}</div>}
					<button type="submit">Search</button>
				</form>
			)}

			{displayState === E_DISPLAY_STATE.INFO &&
				codeSearchMutation.isSuccess &&
				codeSearchMutation.data && (
					<div className={styles.user_info}>
						<div className={styles.prompt}>Is this you?</div>
						<div className={styles.box}>
							<div>
								{codeSearchMutation.data.first_name}{" "}
								{codeSearchMutation.data.last_name}
							</div>
							<div>{codeSearchMutation.data.username}</div>
							<div className={styles.icons}>
								<FaCheckCircle
									className={styles.check}
									onClick={() => setDisplayState(E_DISPLAY_STATE.FORM)}
								/>
								<MdCancel
									className={styles.cancel}
									onClick={() => {
										setCode("");
										setDisplayState(E_DISPLAY_STATE.INIT);
									}}
								/>
							</div>
						</div>
					</div>
				)}

			{displayState === E_DISPLAY_STATE.FORM && (
				<form
					className={styles.form}
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						passwordForm.handleSubmit();
					}}
				>
					<passwordForm.Field
						name="password"
						children={(field) => (
							<>
								<h2>New Password</h2>
								<input
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className={
										field.state.meta.errors.length > 0 ? styles.err : ""
									}
									type="password"
								/>
								{field.state.meta.errors ? (
									<div className={styles.err}>
										{field.state.meta.errors.join(", ")}
									</div>
								) : null}
							</>
						)}
						validators={{
							onChange: ({ value }) => {
								return value.includes(" ")
									? "Password cannot contain spaces"
									: undefined;
							},
							onSubmit: ({ value }) => {
								return value === "" ? "Cannot be empty" : undefined;
							},
						}}
					/>

					<passwordForm.Field
						name="confirm_password"
						children={(field) => (
							<>
								<h2>Confirm Password</h2>
								<input
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className={
										field.state.meta.errors.length > 0 ? styles.err : ""
									}
									type="password"
								/>
								{field.state.meta.errors ? (
									<div className={styles.err}>
										{field.state.meta.errors.join(", ")}
									</div>
								) : null}
							</>
						)}
						validators={{
							onChange: ({ value }) => {
								return value.includes(" ")
									? "Password cannot contain spaces"
									: undefined;
							},
							onSubmit: ({ value }) => {
								return value === "" ? "Cannot be empty" : undefined;
							},
						}}
					/>

					{error && <div className={styles.err}>{error}</div>}
					<button type="submit">Submit</button>
				</form>
			)}
		</div>
	);
};

export default PasswordReset;
