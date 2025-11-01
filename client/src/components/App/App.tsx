import styles from "./App.module.scss";
import { Route, Routes } from "react-router-dom";
import ContentBox from "../ContentBox/ContentBox";
import ProtectedApp from "./children/ProtectedApp/ProtectedApp";
import Loading from "../Loading/Loading";
import TopBar from "./children/TopBar/TopBar";
import UnprotectedApp from "./children/UnprotectedApp/UnprotectedApp";
import { useAuthCtx } from "../../contexts/AuthProvider";
import useUserDataQuery from "../../queries/userDataQuery";
import { USER_ROLES } from "../../utils/consts";
import useTeacherDataQuery from "../../queries/teacherDataQuery";

const App: React.FC = () => {
	// get auth status
	const authData = useAuthCtx();

	// get user info
	const userDataQuery = useUserDataQuery(authData);

	// fetch teacher data if user role == teacher
	const teacherDataQuery = useTeacherDataQuery(
		authData.tokens.curr,
		authData.valid &&
			userDataQuery.isSuccess &&
			userDataQuery.data.user_data.role === USER_ROLES.TEACHER,
	);

	return (
		<div className={styles.root}>
			<TopBar />

			<ContentBox>
				{userDataQuery.isFetching || teacherDataQuery.isFetching ? (
					<Loading />
				) : (
					<Routes>
						{authData.valid && userDataQuery.isSuccess ? (
							<Route
								path="*"
								element={
									<ProtectedApp userData={userDataQuery.data.user_data} />
								}
							/>
						) : (
							<Route path="*" element={<UnprotectedApp />} />
						)}
					</Routes>
				)}
			</ContentBox>
		</div>
	);
};

export default App;
