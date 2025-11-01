import styles from "./Teacher.module.scss";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { E_REGISTER_RESULT } from "../../../../types";
import { sendTokensToLocalStorage } from "../../../../utils/methods";
import {
	INIT_FORM_REGISTER_TEACHER,
	T_FORM_REGISTER_TEACHER,
} from "../../Register";
import REGISTER_TEACHER, {
	T_PARAMS,
	T_RES,
} from "../../../../api/routes/register/register_teacher";
import { useAuthCtx } from "../../../../contexts/AuthProvider";

function isAlpha(input: string): boolean {
	let regex = /^[a-zA-Z]+$/;
	return regex.test(input);
}

const Teacher: React.FC = () => {
	const [errMessage, setErrMessage] = useState<string>("");

	const auth = useAuthCtx();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: (params: T_PARAMS): Promise<T_RES> => REGISTER_TEACHER(params),
		onError(err) {
			console.log(err);
			alert("Error, please refresh and try again");
		},
		onSuccess(data) {
			switch (data.result) {
				case E_REGISTER_RESULT.VALID:
					sendTokensToLocalStorage(data.tokens);
					auth.tokens.set(data.tokens);
					queryClient.resetQueries();

					navigate("/");
					break;
				case E_REGISTER_RESULT.USERNAME_EXISTS:
					setErrMessage(
						`Username '${form.getFieldValue("username")}' already exists`,
					);
			}
		},
	});

	const form = useForm<T_FORM_REGISTER_TEACHER>({
		defaultValues: {
			...INIT_FORM_REGISTER_TEACHER,
		},
		onSubmit: ({ value }) => {
			const obj: T_FORM_REGISTER_TEACHER = {
				first_name: value.first_name.trim(),
				last_name: value.last_name.trim(),
				username: value.username.trim(),
				password: value.password.trim(),
				confirm_password: value.confirm_password.trim(),
				email: value.email.trim(),
				school: value.school.trim(),
			};

			mutate(obj);
		},
	});

	return (
		<div className={styles.root}>
			<form
				className={styles.form}
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<form.Field
					name="first_name"
					children={(field) => (
						<>
							<h2>First Name</h2>
							<input
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className={field.state.meta.errors.length > 0 ? styles.err : ""}
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
							if (!isAlpha(value) && value !== "") {
								return "Names can only contain letters";
							}

							return undefined;
						},
						onSubmit: ({ value }) => {
							return value === "" ? "Cannot be empty" : undefined;
						},
					}}
				/>
				<form.Field
					name="last_name"
					children={(field) => (
						<>
							<h2>Last Name</h2>
							<input
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className={field.state.meta.errors.length > 0 ? styles.err : ""}
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
							if (!isAlpha(value) && value !== "") {
								return "Names can only contain letters";
							}

							return undefined;
						},
						onSubmit: ({ value }) => {
							return value === "" ? "Cannot be empty" : undefined;
						},
					}}
				/>
				<form.Field
					name="username"
					children={(field) => (
						<>
							<h2>Username</h2>
							<input
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className={field.state.meta.errors.length > 0 ? styles.err : ""}
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
							if (value.includes(" ")) {
								return "Username cannot contain spaces";
							} else if (!isAlpha(value) && value !== "") {
								return "Username can only contain letters";
							}

							return undefined;
						},
						onSubmit: ({ value }) => {
							return value === "" ? "Cannot be empty" : undefined;
						},
					}}
				/>
				<form.Field
					name="password"
					children={(field) => (
						<>
							<h2>Password</h2>
							<input
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className={field.state.meta.errors.length > 0 ? styles.err : ""}
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
				<form.Field
					name="confirm_password"
					children={(field) => (
						<>
							<h2>Confirm Password</h2>
							<input
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className={field.state.meta.errors.length > 0 ? styles.err : ""}
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
							if (value.includes(" ")) {
								return "Password cannot contain spaces";
							}

							return undefined;
						},
						onSubmit: ({ value, fieldApi }) => {
							if (value === "") {
								return "Cannot be empty";
							} else if (value !== fieldApi.form.getFieldValue("password")) {
								return "Passwords must match";
							}

							return undefined;
						},
					}}
				/>
				<form.Field
					name="email"
					children={(field) => (
						<>
							<h2>Email</h2>
							<input
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className={field.state.meta.errors.length > 0 ? styles.err : ""}
								type="email"
								inputMode="email"
							/>
							{field.state.meta.errors ? (
								<div className={styles.err}>
									{field.state.meta.errors.join(", ")}
								</div>
							) : null}
						</>
					)}
					validators={{
						// onChange: ({ value }) => {
						//
						//   return undefined;
						// },
						onSubmit: ({ value }) => {
							return value === "" ? "Cannot be empty" : undefined;
						},
					}}
				/>
				<form.Field
					name="school"
					children={(field) => (
						<>
							<h2>School</h2>
							<input
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className={field.state.meta.errors.length > 0 ? styles.err : ""}
								type="text"
								inputMode="text"
							/>
							{field.state.meta.errors ? (
								<div className={styles.err}>
									{field.state.meta.errors.join(", ")}
								</div>
							) : null}
						</>
					)}
					validators={{
						// onChange: ({ value }) => {
						//
						//   return undefined;
						// },
						onSubmit: ({ value }) => {
							return value === "" ? "Cannot be empty" : undefined;
						},
					}}
				/>

				{<div className={styles.err}>{errMessage}</div>}
				<button type="submit">Register</button>
			</form>
		</div>
	);
};

export default Teacher;
