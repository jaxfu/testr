import { FaEdit } from "react-icons/fa";
import {
	MdLockReset,
	MdDeleteForever,
	MdCancel,
	MdCheckCircle,
} from "react-icons/md";
import Locals, { E_MODES } from "../../Locals";
import styles from "./Buttons.module.scss";
import { useEditedStudentInfoCtx } from "../../EditedStudentInfoProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthCtx } from "../../../../../../../../contexts/AuthProvider";

interface IProps {
	mode: {
		curr: E_MODES;
		set: React.Dispatch<React.SetStateAction<E_MODES>>;
	};
}

const Buttons: React.FC<IProps> = (props) => {
	const editedStudentInfoCtx = useEditedStudentInfoCtx();

	const authCtx = useAuthCtx();
	const queryClient = useQueryClient();
	const updateStudentMutation = Locals.useUpdateStudentMutation(queryClient);
	const getPasswordResetCodeMutation = Locals.useGetPasswordResetCodeMutation();

	switch (props.mode.curr) {
		case E_MODES.DISPLAY:
			return (
				<div className={styles.root}>
					<span onClick={() => props.mode.set(E_MODES.EDITING)}>
						<FaEdit className={styles.icon} id={styles.edit} />
						<div className={styles.context}>Edit</div>
					</span>

					<span
						onClick={() =>
							getPasswordResetCodeMutation.mutate({
								tokens: authCtx.tokens.curr,
								id: editedStudentInfoCtx.curr.user_id,
							})
						}
					>
						<MdLockReset className={styles.icon} id={styles.reset} />
						<div className={styles.context}>Reset Password</div>
					</span>

					<span onClick={() => props.mode.set(E_MODES.CONFIRM_DELETE)}>
						<MdDeleteForever className={styles.icon} id={styles.delete} />
						<div className={styles.context} id={styles.last}>
							Delete
						</div>
					</span>
				</div>
			);
		case E_MODES.EDITING:
			return (
				<div className={styles.root}>
					<span
						onClick={() =>
							updateStudentMutation.mutate({
								tokens: authCtx.tokens.curr,
								info: editedStudentInfoCtx.curr,
							})
						}
					>
						<MdCheckCircle className={styles.icon} id={styles.confirm} />
						<div className={styles.context}>Confirm</div>
					</span>

					<span onClick={() => props.mode.set(E_MODES.DISPLAY)}>
						<MdCancel className={styles.icon} id={styles.cancel} />
						<div className={styles.context} id={styles.last}>
							Cancel
						</div>
					</span>
				</div>
			);
	}
};

export default Buttons;
