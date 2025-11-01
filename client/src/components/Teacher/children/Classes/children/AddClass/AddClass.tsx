import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useAuthCtx } from "../../../../../../contexts/AuthProvider";
import styles from "./AddClass.module.scss";
import Locals from "./Locals";

enum E_MODES {
	BUTTON = 0,
	ADDING,
}

const AddClass: React.FC = () => {
	const [mode, setMode] = useState<E_MODES>(E_MODES.BUTTON);

	const auth = useAuthCtx();
	const queryClient = useQueryClient();
	const addClassMutation = Locals.useAddClassMutation(queryClient);

	const ref: React.MutableRefObject<HTMLInputElement | null> = useRef(null);

	switch (mode) {
		case E_MODES.BUTTON:
			return <button onClick={() => setMode(E_MODES.ADDING)}>Add Class</button>;
		case E_MODES.ADDING:
			return (
				<form
					className={styles.card}
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						if (ref.current) {
							addClassMutation.mutate({
								cl: {
									name: ref.current.value.trim(),
									class_id: 1,
									teacher_id: 1,
									population: 0,
								},
								tokens: auth.tokens.curr,
							});
						}
					}}
				>
					<label htmlFor="classname">Name</label>
					<input
						type="text"
						name="classname"
						id="classname"
						autoComplete="off"
						required={true}
						minLength={1}
						ref={ref}
					/>
					<button>Add</button>
				</form>
			);
	}
};

export default AddClass;
