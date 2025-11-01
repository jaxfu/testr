import { createContext, useContext, useState } from "react";

export type T_EDITED_STUDENT_INFO = {
	first_name: string;
	last_name: string;
	username: string;
	class_id: number;
	user_id: number;
};

const editedStudentInfoCtx = createContext<
	| {
			curr: T_EDITED_STUDENT_INFO;
			set: React.Dispatch<React.SetStateAction<T_EDITED_STUDENT_INFO>>;
	  }
	| undefined
>(undefined);

interface IProps {
	children: React.ReactNode;
	init: T_EDITED_STUDENT_INFO;
}

const EditedStudentInfoProvider: React.FC<IProps> = (props) => {
	const [info, setInfo] = useState<T_EDITED_STUDENT_INFO>(props.init);

	return (
		<editedStudentInfoCtx.Provider value={{ curr: info, set: setInfo }}>
			{props.children}
		</editedStudentInfoCtx.Provider>
	);
};

export const useEditedStudentInfoCtx = () => {
	const ctx = useContext(editedStudentInfoCtx);

	if (ctx === undefined) {
		throw new Error("Context not established");
	} else return ctx;
};

export default EditedStudentInfoProvider;
