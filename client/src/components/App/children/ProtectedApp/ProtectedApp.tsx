import { Routes, Route, Navigate } from "react-router-dom";
import { T_USERDATA } from "../../../../types";
import { USER_ROLES } from "../../../../utils/consts";
import Game from "../../../Game/Game";
import Home from "../../../Home/Home";
import Loading from "../../../Loading/Loading";
import Classes from "../../../Teacher/children/Classes/Classes";
import Class from "../../../Teacher/children/Classes/children/Class/Class";
import Student from "../../../Teacher/children/Student/Student";
import Settings from "../../../Settings/Settings";

interface IProps {
	userData: T_USERDATA;
}

const ProtectedApp: React.FC<IProps> = (props) => {
	return (
		<>
			<Routes>
				<Route
					path="/"
					element={
						props.userData ? <Home userData={props.userData} /> : <Loading />
					}
				/>
				<Route
					path="/game/*"
					element={<Game vertical={props.userData.vertical} />}
				/>
				<Route
					path="/teacher/classes"
					element={
						props.userData.role === USER_ROLES.TEACHER ? (
							<Classes />
						) : (
							<Navigate to={"/"} replace />
						)
					}
				/>
				<Route
					path="/teacher/class/:id"
					element={
						props.userData.role === USER_ROLES.TEACHER ? (
							<Class />
						) : (
							<Navigate to={"/"} replace />
						)
					}
				/>
				<Route
					path="/teacher/student/:id"
					element={
						props.userData.role === USER_ROLES.TEACHER ? (
							<Student />
						) : (
							<Navigate to={"/"} replace />
						)
					}
				/>
				<Route path={"/settings"} element={<Settings />} />

				<Route path="*" element={<Navigate to={"/"} replace />} />
			</Routes>
		</>
	);
};

export default ProtectedApp;
