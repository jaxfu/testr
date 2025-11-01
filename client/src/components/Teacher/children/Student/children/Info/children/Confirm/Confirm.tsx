import { MdCancel } from "react-icons/md";
import { type T_CLASS } from "../../../../../../../../types/teacherData";
import { type T_STUDENT_DATA } from "../../../../../../../../types/users";
import styles from "./Confirm.module.scss";
import { FaCheck } from "react-icons/fa6";
import Locals, { E_MODES } from "../../Locals";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthCtx } from "../../../../../../../../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";

interface IProps {
	mode: {
		curr: E_MODES;
		set: React.Dispatch<React.SetStateAction<E_MODES>>;
	};
	cl: T_CLASS;
	student: T_STUDENT_DATA;
}

const Confirm: React.FC<IProps> = (props) => {
	const auth = useAuthCtx();
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const deleteStudentMutation = Locals.useDeleteStudentMutation(
		queryClient,
		navigate,
		props.cl.class_id,
	);

	return (
		<section className={styles.root}>
			<div className={styles.content}>
				Are you sure you want to delete <br />{" "}
				<span>
					{props.student.first_name} {props.student.last_name}
				</span>
				from
				<span>{props.cl.name}</span>
				<div className={styles.buttons}>
					<span
						id={styles.check}
						onClick={() => {
							switch (props.mode.curr) {
								case E_MODES.CONFIRM_DELETE:
									deleteStudentMutation.mutate({
										tokens: auth.tokens.curr,
										id: props.student.user_id,
									});
									break;
							}
						}}
					>
						<FaCheck />
					</span>

					<span
						id={styles.cancel}
						onClick={() => props.mode.set(E_MODES.DISPLAY)}
					>
						<MdCancel />
					</span>
				</div>
			</div>
		</section>
	);
};

export default Confirm;
