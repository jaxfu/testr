import { QueryClient, useMutation } from "@tanstack/react-query";
import LOGIN, { T_PARAMS, T_RES } from "../../api/routes/login/login";
import { sendTokensToLocalStorage } from "../../utils/methods";
import { T_AUTH } from "../../contexts/AuthProvider";

const Locals = {
	useLoginMutation: (
		auth: T_AUTH,
		queryClient: QueryClient,
		setIncorrectInfo: React.Dispatch<React.SetStateAction<boolean>>,
	) =>
		useMutation({
			mutationFn: (params: T_PARAMS): Promise<T_RES> => LOGIN(params),
			onError(err) {
				console.log(err);
			},
			// TODO: handle error vs incorrect info
			onSuccess(data) {
				if (data.valid) {
					sendTokensToLocalStorage(data.tokens);
					auth.tokens.set(data.tokens);
					queryClient.resetQueries();
				} else {
					setIncorrectInfo(true);
				}
			},
		}),
};

export default Locals;
