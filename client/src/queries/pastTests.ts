import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../utils/consts";
import { T_AUTH } from "../contexts/AuthProvider";
import GET_PAST_TESTS from "../api/routes/user/getPastTests";

const usePastTestsQuery = (auth: T_AUTH) =>
	useQuery({
		queryKey: [QUERY_KEYS.USER_GAME_SESSIONS],
		queryFn: () => GET_PAST_TESTS(auth.tokens.curr),
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
	});

export default usePastTestsQuery;
