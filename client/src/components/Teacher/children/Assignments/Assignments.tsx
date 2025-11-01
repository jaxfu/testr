import { useQuery } from "@tanstack/react-query";
import styles from "./Assignments.module.scss";
import { apiRequestGetAssignmentsTeacher } from "../../../../../requests";
import { QUERY_KEYS } from "../../../../utils/consts";
import { getUserSessionDataFromStorage } from "../../../../utils/methods";
import UIHandlers from "../../../../utils/uiHandlers";
import Loading from "../../../Loading/Loading";
import type { T_CLASS } from "../../../Register/Register";

interface IProps {
	classes: T_CLASS[];
}

const Assignments: React.FC<IProps> = (props) => {
	const { isFetching, isSuccess, data } = useQuery({
		queryKey: [QUERY_KEYS.TEACHER_ASSIGNMENTS],
		queryFn: () =>
			apiRequestGetAssignmentsTeacher(getUserSessionDataFromStorage()),
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
	});

	if (isFetching) {
		return <Loading />;
	} else if (isSuccess && data && data.data !== undefined) {
		return (
			<div className={styles.root}>
				<div className={styles.ass_cont}>
					{data.data.length > 0 ? (
						<div className={styles.assignments}>
							{data.data.map((a, i) => {
								return (
									<div key={`assignment-${i}`} className={styles.assignment}>
										<div>{UIHandlers.convertUnixTimestamp(a.due)}</div>
									</div>
								);
							})}
						</div>
					) : (
						<div>No assignments</div>
					)}
				</div>
			</div>
		);
	} else {
		return <div>Error, please refresh</div>;
	}
};

export default Assignments;
