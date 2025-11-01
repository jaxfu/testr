import { useMutation, UseMutationResult } from "@tanstack/react-query";
import CHECK_USERNAME, {
	T_PARAMS,
	T_RES,
} from "../../../../../../api/routes/register/check_username";
import { useForm } from "@tanstack/react-form";
import {
	T_FORM_REGISTER_STUDENT,
	INIT_FORM_REGISTER_STUDENT,
} from "../../../../Register";

const Locals = {
	useCheckUsernameMutation: (
		setTeacherMode: React.Dispatch<React.SetStateAction<boolean>>,
		setErrMessage: React.Dispatch<React.SetStateAction<string>>,
	) =>
		useMutation({
			mutationFn: (params: T_PARAMS): Promise<T_RES> => CHECK_USERNAME(params),
			onError(err) {
				console.log(err);
				alert("Error, please refresh and try again");
			},
			onSuccess(data) {
				if (data.valid) {
					setTeacherMode(true);
				} else {
					setErrMessage("Username already exists");
				}
			},
		}),
	useRegisterForm: (
		setFormData: React.Dispatch<React.SetStateAction<T_FORM_REGISTER_STUDENT>>,
		checkUsernameMutation: UseMutationResult<T_RES, Error, T_PARAMS, unknown>,
	) =>
		useForm<T_FORM_REGISTER_STUDENT>({
			defaultValues: {
				...INIT_FORM_REGISTER_STUDENT,
			},
			onSubmit: ({ value }) => {
				const obj: T_FORM_REGISTER_STUDENT = {
					first_name: value.first_name.trim(),
					last_name: value.last_name.trim(),
					username: value.username.trim(),
					password: value.password.trim(),
					confirm_password: value.password.trim(),
					class_id: 0,
					teacher_id: 0,
				};

				setFormData(obj);
				checkUsernameMutation.mutate({ username: value.username.trim() });
			},
		}),
};

export default Locals;
