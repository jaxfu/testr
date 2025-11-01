import { QueryClient, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../../../utils/consts";
import ADD_CLASS, {
	T_PARAMS,
} from "../../../../../../api/routes/teacher/classes/addClass";

const Locals = {
	useAddClassMutation: (queryClient: QueryClient) =>
		useMutation({
			mutationFn: (params: T_PARAMS): Promise<Response> => ADD_CLASS(params),
			onError(err) {
				console.log(err);
				alert("Error, please refresh and try again");
			},
			onSuccess() {
				queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEACHER_DATA] });
			},
		}),
};

export default Locals;
