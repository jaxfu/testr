import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../utils/consts";
import GET_STUDENT_DATA, {
	T_PARAMS,
} from "../api/routes/teacher/students/getStudentData";

const useStudentDataQuery = (params: T_PARAMS, enabled: boolean) =>
	useQuery({
		queryKey: [QUERY_KEYS.STUDENT_DATA, params.id],
		queryFn: () => GET_STUDENT_DATA(params),
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
		enabled,
	});

export default useStudentDataQuery;
