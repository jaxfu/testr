import styles from "./ChangeClass.module.scss";
import { E_MODES } from "../../Locals";
import { T_CLASS } from "../../../../../../../../types/teacherData";
import { useEditedStudentInfoCtx } from "../../EditedStudentInfoProvider";

interface IProps {
	cl: T_CLASS;
	classes: T_CLASS[];
	mode: E_MODES;
}

const ChangeClass: React.FC<IProps> = (props) => {
	const editedStudentInfoCtx = useEditedStudentInfoCtx();

	function changeHandler(e: React.ChangeEvent<HTMLSelectElement>) {
		editedStudentInfoCtx.set((curr) => {
			return {
				...curr,
				class_id: Number.parseInt(e.target.value),
			};
		});
	}

	switch (props.mode) {
		case E_MODES.DISPLAY:
			return <div className={styles.root}>{props.cl.name} </div>;
		case E_MODES.EDITING:
			return (
				<div className={styles.root}>
					<select
						name="class_select"
						id="class_select"
						value={editedStudentInfoCtx.curr.class_id}
						onChange={changeHandler}
					>
						{props.classes.map((cl) => {
							return (
								<option value={cl.class_id} key={cl.class_id}>
									{cl.name}
								</option>
							);
						})}
					</select>
				</div>
			);
	}
};

export default ChangeClass;
