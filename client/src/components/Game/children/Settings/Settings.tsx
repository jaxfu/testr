import styles from "./Settings.module.scss";
import { useForm } from "@tanstack/react-form";
import {
	type T_GAME_SETTINGS,
	E_GAME_LIMIT_TYPES,
} from "../../../../types/game";
import Locals, { type T_SETTINGS_FORM } from "./Locals";
import { deepCopyObject } from "../../../../utils/methods";
import { FaClock, FaQuestionCircle, FaPlay } from "react-icons/fa";

interface IProps {
	startGame: (settings: T_GAME_SETTINGS) => void;
}

const Settings: React.FC<IProps> = (props) => {
	const form = useForm<T_SETTINGS_FORM>({
		defaultValues: {
			...deepCopyObject(Locals.INIT_SETTINGS_FORM),
		},
		validators: {
			onSubmit({ value }) {
				return !value.ops.add &&
					!value.ops.sub &&
					!value.ops.mult &&
					!value.ops.div
					? "Choose at least one operation"
					: undefined;
			},
		},
		onSubmit: ({ value }) => {
			const obj: T_GAME_SETTINGS = {
				min: Number.parseInt(value.range.min as string) | 0,
				max: Number.parseInt(value.range.max as string) | 0,
				add: value.ops.add,
				sub: value.ops.sub,
				mult: value.ops.mult,
				div: value.ops.div,
				limit_type: value.limits.type,
				limit_amount: Number.parseInt(value.limits.count as string) | 0,
			};

			props.startGame({ ...obj });
		},
	});
	const formErrorMap = form.useStore((state) => state.errorMap);

	return (
		<div className={styles.root}>
			<div className={styles.scroll}>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<div className={styles.range}>
						<div className={styles.min}>
							<form.Field
								name="range.min"
								children={(field) => (
									<>
										<input
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											className={
												field.state.meta.errors.length > 0
													? styles.errInput
													: ""
											}
											type="number"
											placeholder="Min"
										/>
										{field.state.meta.errors.length > 0 ? (
											<div className={styles.err}>
												{field.state.meta.errors.join(", ")}
											</div>
										) : null}
									</>
								)}
								validators={{
									onChange: ({ value, fieldApi }) => {
										if (
											!Number.isNaN(value) &&
											!Number.isNaN(fieldApi.form.getFieldValue("range.max")) &&
											Number.parseInt(value as string) >=
												Number.parseInt(
													fieldApi.form.getFieldValue("range.max") as string,
												)
										) {
											return "Min must be less than max";
										}

										return undefined;
									},
									onSubmit: ({ value }) => {
										if (value === "") {
											return "Cannot be empty";
										} else if (Number.isNaN(value as string)) {
											return "Invalid value";
										}

										return undefined;
									},
								}}
							/>
						</div>
						<div className={styles.div}>-</div>
						<div className={styles.max}>
							<form.Field
								name="range.max"
								children={(field) => (
									<>
										<input
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											className={
												field.state.meta.errors.length > 0
													? styles.errInput
													: ""
											}
											type="number"
											placeholder="Max"
										/>
										{field.state.meta.errors.length > 0 ? (
											<div className={styles.err}>
												{field.state.meta.errors.join(", ")}
											</div>
										) : null}
									</>
								)}
								validators={{
									onChange: ({ value, fieldApi }) => {
										if (
											!Number.isNaN(value) &&
											!Number.isNaN(fieldApi.form.getFieldValue("range.min")) &&
											Number.parseInt(value as string) <=
												Number.parseInt(
													fieldApi.form.getFieldValue("range.min") as string,
												)
										) {
											return "Max must be more than min";
										}

										return undefined;
									},
									onSubmit: ({ value }) => {
										if (value === "") {
											return "Cannot be empty";
										} else if (Number.isNaN(value as string)) {
											return "Invalid value";
										}

										return undefined;
									},
								}}
							/>
						</div>
					</div>

					<div className={styles.ops}>
						<div className={styles.add}>
							<form.Field
								name="ops.add"
								children={(field) => (
									<div
										onClick={() => {
											field.setValue(!field.getValue());
										}}
										className={
											field.getValue() ? styles.checked : styles.unchecked
										}
									>
										&#x002B;
									</div>
								)}
							/>
						</div>
						<div className={styles.sub}>
							<form.Field
								name="ops.sub"
								children={(field) => (
									<div
										onClick={() => {
											field.setValue(!field.getValue());
										}}
										className={
											field.getValue() ? styles.checked : styles.unchecked
										}
									>
										&minus;
									</div>
								)}
							/>
						</div>
						<div className={styles.mult}>
							<form.Field
								name="ops.mult"
								children={(field) => (
									<div
										onClick={() => {
											field.setValue(!field.getValue());
										}}
										className={
											field.getValue() ? styles.checked : styles.unchecked
										}
									>
										&times;
									</div>
								)}
							/>
						</div>
						<div className={styles.div}>
							<form.Field
								name="ops.div"
								children={(field) => (
									<div
										onClick={() => {
											field.setValue(!field.getValue());
										}}
										className={
											field.getValue() ? styles.checked : styles.unchecked
										}
									>
										&divide;
									</div>
								)}
							/>
						</div>
					</div>
					{formErrorMap.onSubmit !== undefined && (
						<div className={styles.ops_error}>{formErrorMap.onSubmit}</div>
					)}

					<form.Field
						name="limits.type"
						children={(field) => (
							<div className={styles.limits}>
								<div
									className={`${styles.time} ${
										field.getValue() === E_GAME_LIMIT_TYPES.TIME
											? styles.checked
											: styles.unchecked
									}`}
									onClick={() => {
										field.setValue(E_GAME_LIMIT_TYPES.TIME);
									}}
								>
									<FaClock />
								</div>

								<div
									className={`${styles.questions} ${
										field.getValue() === E_GAME_LIMIT_TYPES.COUNT
											? styles.checked
											: styles.unchecked
									}`}
									onClick={() => {
										field.setValue(E_GAME_LIMIT_TYPES.COUNT);
									}}
								>
									<FaQuestionCircle />
								</div>
							</div>
						)}
					/>

					<form.Field
						name="limits.count"
						children={(field) => (
							<div className={styles.limit_count}>
								<div>
									<input
										type="number"
										inputMode="numeric"
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className={
											field.state.meta.errors.length > 0 ? styles.errInput : ""
										}
									/>
									{field.state.meta.errors.length > 0 ? (
										<div className={styles.err}>
											{field.state.meta.errors.join(", ")}
										</div>
									) : null}
									<form.Subscribe
										selector={(state) => state.values.limits.type}
										children={(type) => (
											<span>
												{type === E_GAME_LIMIT_TYPES.TIME
													? "Seconds"
													: "Questions"}
											</span>
										)}
									/>
								</div>
							</div>
						)}
						validators={{
							onSubmit: ({ value }) => {
								if (value === "") {
									return "Cannot be empty";
								} else if (Number.isNaN(value as string)) {
									return "Invalid value";
								} else if (Number.parseInt(value as string) <= 1) {
									return "Must be greater than 0";
								}

								return undefined;
							},
						}}
					/>

					<button className={styles.button} type="submit">
						<FaPlay className={styles.img} />
					</button>
				</form>
			</div>
		</div>
	);
};

export default Settings;
