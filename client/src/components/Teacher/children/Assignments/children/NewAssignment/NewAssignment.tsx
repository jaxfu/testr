import { useForm } from "@tanstack/react-form";
import { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { E_GAME_LIMIT_TYPES } from "../../../../../../../../types/game";
import {
	deepCopyObject,
	getUserSessionDataFromStorage,
} from "../../../../../../../../utils/methods";
import type { T_SETTINGS_FORM } from "../../../../../../../Game/children/Settings/Locals";
import Locals from "./Locals";
import styles from "./NewAssignment.module.scss";
import { T_CLASS } from "../../../../../../../Register/Register";
import { T_ASSIGNMENT } from "../../../../../../../../types/assignments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import {
	I_PARAMS_APIREQUEST_ADD_ASSIGNMENT,
	apiRequestAddAssignment,
} from "../../../../../../../../../requests";
import { QUERY_KEYS } from "../../../../../../../../utils/consts";

interface IProps {
	classes: T_CLASS[];
}

const NewAssignment: React.FC<IProps> = (props) => {
	const [timeLimit, setTimeLimit] = useState<boolean>(true);
	const [dueDate, setDueDate] = useState<Date>(new Date());

	const classes = useRef<number[]>(props.classes.map((c) => c.class_id));

	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (
			params: I_PARAMS_APIREQUEST_ADD_ASSIGNMENT,
		): Promise<AxiosResponse> => {
			return apiRequestAddAssignment(params);
		},
		onError(err) {
			console.log(err);
			alert("Error, please refresh and try again");
		},
		onSuccess() {
			console.log("success");
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.TEACHER_ASSIGNMENTS],
			});
		},
	});

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
			const assignment: T_ASSIGNMENT = {
				min: Number.parseInt(value.range.min as string) | 0,
				max: Number.parseInt(value.range.max as string) | 0,
				add: value.ops.add,
				sub: value.ops.sub,
				mult: value.ops.mult,
				div: value.ops.div,
				limit_type: timeLimit
					? E_GAME_LIMIT_TYPES.TIME
					: E_GAME_LIMIT_TYPES.COUNT,
				limit_amount: timeLimit
					? Number.parseInt(value.limits.time as string)
					: Number.parseInt(value.limits.count as string),
				due: Locals.endOfDayTimestamp(dueDate),
				classes: classes.current,
				name: "",
			};

			mutation.mutate({ tokens: getUserSessionDataFromStorage(), assignment });
		},
	});
	const formErrorMap = form.useStore((state) => state.errorMap);

	return (
		<div className={styles.root}>
			<div className={styles.date}>
				Due on:{" "}
				<DatePicker
					selected={dueDate}
					onChange={(date) => date && setDueDate(date)}
					wrapperClassName={styles.date_picker}
				/>
			</div>

			<div className={styles.classes}>
				{props.classes.map((c) => {
					return (
						<div key={c.class_id} className={styles.box}>
							<label htmlFor={c.class_id.toString()}>{c.name}</label>
							<input
								onChange={(e) => {
									if (!e.target.checked)
										classes.current = classes.current
											.filter((id) => id !== c.class_id)
											.sort();
									else {
										const curr = [...classes.current];
										curr.push(c.class_id);
										classes.current = curr.sort();
									}
								}}
								defaultChecked={true}
								type="checkbox"
								id={c.class_id.toString()}
								name={c.class_id.toString()}
							/>
						</div>
					);
				})}
			</div>

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
									<h2>Min</h2>
									<input
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className={
											field.state.meta.errors.length > 0 ? styles.errInput : ""
										}
										type="number"
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
					<div className={styles.max}>
						<form.Field
							name="range.max"
							children={(field) => (
								<>
									<h2>Max</h2>
									<input
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className={
											field.state.meta.errors.length > 0 ? styles.errInput : ""
										}
										type="number"
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
								<>
									<h2>&#x002B;</h2>
									<input
										type="checkbox"
										name={field.name}
										checked={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.checked)}
									/>
								</>
							)}
						/>
					</div>
					<div className={styles.sub}>
						<form.Field
							name="ops.sub"
							children={(field) => (
								<>
									<h2>&minus;</h2>
									<input
										type="checkbox"
										name={field.name}
										checked={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.checked)}
									/>
								</>
							)}
						/>
					</div>
					<div className={styles.mult}>
						<form.Field
							name="ops.mult"
							children={(field) => (
								<>
									<h2>&times;</h2>
									<input
										type="checkbox"
										name={field.name}
										checked={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.checked)}
									/>
								</>
							)}
						/>
					</div>
					<div className={styles.div}>
						<form.Field
							name="ops.div"
							children={(field) => (
								<>
									<h2>&divide;</h2>
									<input
										type="checkbox"
										name={field.name}
										checked={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.checked)}
									/>
								</>
							)}
						/>
					</div>
				</div>
				{formErrorMap.onSubmit !== undefined && (
					<div className={styles.ops_error}>{formErrorMap.onSubmit}</div>
				)}
				<div className={styles.limits}>
					<div className={styles.time}>
						<h2>Time Limit (s)</h2>
						<input
							type="checkbox"
							name="time_limit_check"
							checked={timeLimit}
							onClick={() => !timeLimit && setTimeLimit(true)}
							onChange={() => console.log("")}
						/>
						<form.Field
							name="limits.time"
							children={(field) => (
								<>
									<input
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className={`${
											field.state.meta.errors.length > 0 ? styles.errInput : ""
										} ${timeLimit ? "" : styles.hidden}`}
										type="number"
										inputMode="numeric"
									/>
									{field.state.meta.errors.length > 0 ? (
										<div className={styles.err}>
											{field.state.meta.errors.join(", ")}
										</div>
									) : null}
								</>
							)}
							validators={{
								onChange: ({ value }) => {
									if (Number.parseInt(value as string) < 0) {
										return "Cannot be negative";
									}

									return undefined;
								},
								onSubmit: ({ value }) => {
									if (
										timeLimit &&
										(value === "" || Number.isNaN(value as string))
									) {
										return "Cannot be empty";
									}

									return undefined;
								},
							}}
						/>
					</div>
					<div className={styles.questions}>
						<h2>Question Limit</h2>
						<input
							type="checkbox"
							name="question_limit_check"
							checked={!timeLimit}
							onClick={() => timeLimit && setTimeLimit(false)}
							onChange={() => console.log("")}
						/>
						<form.Field
							name="limits.count"
							children={(field) => (
								<>
									<input
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className={`${
											field.state.meta.errors.length > 0 ? styles.errInput : ""
										} ${timeLimit ? styles.hidden : ""}`}
										type="number"
										inputMode="numeric"
									/>
									{field.state.meta.errors.length > 0 ? (
										<div className={styles.err}>
											{field.state.meta.errors.join(", ")}
										</div>
									) : null}
								</>
							)}
							validators={{
								onChange: ({ value }) => {
									if (Number.parseInt(value as string) < 0) {
										return "Cannot be negative";
									}

									return undefined;
								},
								onSubmit: ({ value }) => {
									if (
										!timeLimit &&
										(value === "" || Number.isNaN(value as string))
									) {
										return "Cannot be empty";
									}

									return undefined;
								},
							}}
						/>
					</div>
				</div>
				<button type="submit">Add</button>
			</form>
		</div>
	);
};

export default NewAssignment;
