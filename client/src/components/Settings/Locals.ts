import { QueryClient, useMutation } from "@tanstack/react-query";
import UPDATE_VERTICAL_PREF from "../../api/routes/user/updateVerticalPref";
import { T_TOKENS } from "../../types";
import { QUERY_KEYS } from "../../utils/consts";

const Locals = {
	useUpdateVerticalPrefMutation: (queryClient: QueryClient, tokens: T_TOKENS) =>
		useMutation({
			mutationFn: (vertical: boolean) =>
				UPDATE_VERTICAL_PREF({ tokens, vertical }),
			onError(err: any) {
				console.log(err);
			},
			onSuccess() {
				queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_DATA] });
			},
		}),
};

export default Locals;
