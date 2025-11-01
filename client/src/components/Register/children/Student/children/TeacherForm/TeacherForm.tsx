import { type T_FORM_REGISTER_STUDENT } from "../../../../Register";
import styles from "./TeacherForm.module.scss";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Locals from "./Locals";
import { T_RES as T_TEACHER_INFO } from "../../../../../../api/routes/register/get_teacher_info_for_student_register";
import { useAuthCtx } from "../../../../../../contexts/AuthProvider";

interface IProps {
	formData: {
		curr: T_FORM_REGISTER_STUDENT;
		set: React.Dispatch<React.SetStateAction<T_FORM_REGISTER_STUDENT>>;
	};
	teacherMode: {
		curr: boolean;
		set: React.Dispatch<React.SetStateAction<boolean>>;
	};
}

const TeacherForm: React.FC<IProps> = (props) => {
	const [teacherInfo, setTeacherInfo] = useState<T_TEACHER_INFO | undefined>(
		undefined,
	);
	const [errMessage, setErrMessage] = useState<string>("");
	const [classSelection, setClassSelection] = useState<number>(0);

	const auth = useAuthCtx();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const getTeacherInfoMutation = Locals.useTeacherMutation(
		setTeacherInfo,
		setErrMessage,
	);
	const registerStudentMutation = Locals.useRegisterStudentMutation(
		auth,
		queryClient,
		navigate,
	);

	const form = Locals.useRegisterForm(
		props.formData.set,
		getTeacherInfoMutation,
	);

	// set classSelection to first class ID on teacher info fetch
	useEffect(() => {
		if (
			getTeacherInfoMutation.isSuccess &&
			getTeacherInfoMutation.data.classes.length > 0
		) {
			setClassSelection(getTeacherInfoMutation.data.classes[0].class_id);
		}
	}, [getTeacherInfoMutation.isSuccess]);

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
					name="teacher_id"
					children={(field) => (
						<>
							<h2>Teacher Code</h2>
							<input
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => {
									errMessage !== "" && setErrMessage("");
									teacherInfo !== undefined && setTeacherInfo(undefined);
									field.handleChange(e.target.value);
								}}
								className={
									field.state.meta.errors.length > 0 ? styles.errInput : ""
								}
								type="number"
								inputMode="numeric"
							/>
							{field.state.meta.errors.length > 0 ? (
								<div className={styles.err}>
									{field.state.meta.errors.join(", ")}
								</div>
							) : null}
							{<div style={{ color: "red" }}>{errMessage}</div>}
						</>
					)}
					validators={{
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
				{teacherInfo === undefined && <button type="submit">Search</button>}
			</form>
			{teacherInfo !== undefined && (
				<>
					<div className={styles.teacher}>
						<div>
							{teacherInfo.first_name} {teacherInfo.last_name}
						</div>
						<div>{teacherInfo.school}</div>
					</div>
					<div className={styles.classes}>
						<label htmlFor={"class_select"}>Class</label>
						<select
							className={styles.classes}
							name={"class_select"}
							id={"class_select"}
							value={classSelection}
							onChange={(e) =>
								setClassSelection(Number.parseInt(e.target.value))
							}
						>
							{teacherInfo.classes.map((c) => {
								return (
									<option value={c.class_id} key={`$class-${c.class_id}`}>
										{c.name}
									</option>
								);
							})}
						</select>
					</div>

					<button
						className={styles.submit}
						onClick={() =>
							registerStudentMutation.mutate({
								...props.formData.curr,
								class_id: classSelection,
							})
						}
					>
						Submit
					</button>
				</>
			)}
		</div>
	);
};

export default TeacherForm;
