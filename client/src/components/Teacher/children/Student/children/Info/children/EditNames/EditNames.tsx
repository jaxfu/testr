import { T_STUDENT_DATA } from "../../../../../../../../types/users";
import { E_MODES } from "../../Locals";
import styles from "./EditNames.module.scss";
import { useEditedStudentInfoCtx } from "../../EditedStudentInfoProvider";

interface IProps {
	mode: E_MODES;
	student: T_STUDENT_DATA;
}

const EditNames: React.FC<IProps> = (props) => {
	const editedStudentInfoCtx = useEditedStudentInfoCtx();

	function changeHandler(e: React.ChangeEvent<HTMLInputElement>) {
		editedStudentInfoCtx.set((curr) => {
			return {
				...curr,
				[e.target.name]: e.target.value,
			};
		});
	}

	return (
		<div className={styles.root}>
			{props.mode === E_MODES.DISPLAY ? (
				<>
					<div style={{ fontSize: "1.5rem" }}>
						{props.student.last_name}, {props.student.first_name}
					</div>
					<div>{props.student.username}</div>
				</>
			) : (
				<form className={styles.edit} id="edit_names">
					<label htmlFor="first_name">First Name</label>
					<input
						id="first_name"
						name="first_name"
						type="text"
						placeholder="first name"
						autoComplete="off"
						value={editedStudentInfoCtx.curr.first_name}
						onChange={changeHandler}
					/>

					<label htmlFor="last_name">Last Name</label>
					<input
						type="text"
						placeholder="last name"
						id="last_name"
						name="last_name"
						autoComplete="off"
						value={editedStudentInfoCtx.curr.last_name}
						onChange={changeHandler}
					/>

					<label htmlFor="username">Username</label>
					<input
						type="text"
						placeholder="username"
						autoComplete="off"
						id="username"
						name="username"
						value={editedStudentInfoCtx.curr.username}
						onChange={changeHandler}
					/>
				</form>
			)}
		</div>
	);
};

export default EditNames;
