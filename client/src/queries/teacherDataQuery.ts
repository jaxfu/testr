import { useQuery } from "@tanstack/react-query";
import GET_TEACHER_DATA, {
	T_PARAMS,
} from "../api/routes/teacher/getTeacherData";
import { QUERY_KEYS } from "../utils/consts";

const useTeacherDataQuery = (params: T_PARAMS, enabled: boolean) =>
	useQuery({
		queryKey: [QUERY_KEYS.TEACHER_DATA],
		queryFn: () => GET_TEACHER_DATA(params),
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
		enabled,
	});

export default useTeacherDataQuery;
