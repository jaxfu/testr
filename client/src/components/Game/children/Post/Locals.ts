import { QueryClient, useMutation } from "@tanstack/react-query";
import SUBMIT_GAME_SESSION, {
	T_PARAMS,
} from "../../../../api/routes/gamesessions/submitGamesession";
import { QUERY_KEYS } from "../../../../utils/consts";

const Locals = {
	useSubmitGamesessionMutation: (
		queryClient: QueryClient,
		setSent: React.Dispatch<React.SetStateAction<boolean>>,
	) =>
		useMutation({
			mutationFn: (params: T_PARAMS): Promise<Response> =>
				SUBMIT_GAME_SESSION(params),
			onError(err: string) {
				console.log(err);
			},
			onSuccess() {
				queryClient.invalidateQueries({
					queryKey: [QUERY_KEYS.USER_GAME_SESSIONS],
				});
				setSent(true);
			},
		}),
};

export default Locals;
