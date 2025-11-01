import {
	QueryClient,
	useMutation,
	UseMutationResult,
} from "@tanstack/react-query";
import CHECK_PASSWORD_RESET_CODE, {
	T_PARAMS as T_CHECK_PARAMS,
} from "../../../../api/routes/login/checkPasswordResetCode";
import { useForm } from "@tanstack/react-form";
import { T_TOKENS, T_USERDATA } from "../../../../types";
import { NavigateFunction } from "react-router-dom";
import { sendTokensToLocalStorage } from "../../../../utils/methods";
import UPDATE_PASSWORD, {
	T_PARAMS as T_UPDATE_PARAMS,
} from "../../../../api/routes/login/updatePassword";
import { T_AUTH } from "../../../../contexts/AuthProvider";

export enum E_DISPLAY_STATE {
	INIT = 0,
	INFO,
	FORM,
}

export type T_CODE_FORM = {
	username: string;
	code: string;
};

export type T_PASSWORD_FORM = {
	password: string;
	confirm_password: string;
};

const Locals = {
	useCodeSearchMutation: (
		setDisplayState: React.Dispatch<React.SetStateAction<E_DISPLAY_STATE>>,
		setError: React.Dispatch<React.SetStateAction<string>>,
		setCode: React.Dispatch<React.SetStateAction<string>>,
	) =>
		useMutation({
			mutationFn: (params: T_CHECK_PARAMS) => {
				return CHECK_PASSWORD_RESET_CODE(params);
			},
			onError(err) {
				console.log(err);
				setDisplayState(E_DISPLAY_STATE.INIT);
				setError("Code not found");
				setCode("");
			},
			onSuccess() {
				setDisplayState(E_DISPLAY_STATE.INFO);
				setError("");
			},
		}),
	usePasswordUpdateMutation: (
		queryClient: QueryClient,
		authCtx: T_AUTH,
		navigate: NavigateFunction,
		setError: React.Dispatch<React.SetStateAction<string>>,
	) =>
		useMutation({
			mutationFn: (params: T_UPDATE_PARAMS) => {
				return UPDATE_PASSWORD(params);
			},
			onError(err) {
				console.log(err);
				setError("Error encountered, please try again");
			},
			onSuccess(data) {
				sendTokensToLocalStorage(data);
				authCtx.tokens.set(data);
				queryClient.resetQueries();
				navigate("/");
			},
		}),
	useCodeForm: (
		setCode: React.Dispatch<React.SetStateAction<string>>,
		codeSearchMutation: UseMutationResult<
			T_USERDATA,
			Error,
			T_CHECK_PARAMS,
			unknown
		>,
	) =>
		useForm<T_CODE_FORM>({
			defaultValues: {
				username: "",
				code: "",
			},
			onSubmit: ({ value }) => {
				setCode(value.code.trim());
				codeSearchMutation.mutate({
					code: value.code.trim(),
					username: value.username.trim(),
				});
			},
		}),
	usePasswordForm: (
		code: string,
		passwordUpdateMutation: UseMutationResult<
			T_TOKENS,
			Error,
			T_UPDATE_PARAMS,
			unknown
		>,
		setError: React.Dispatch<React.SetStateAction<string>>,
	) =>
		useForm<T_PASSWORD_FORM>({
			defaultValues: {
				password: "",
				confirm_password: "",
			},
			onSubmit: ({ value }) => {
				if (value.password.trim() !== value.confirm_password.trim()) {
					setError("Passwords must be identical");
				} else
					passwordUpdateMutation.mutate({
						code: code,
						password: value.password.trim(),
					});
			},
		}),
};

export default Locals;
