import styles from "./Home.module.scss";
import Loading from "../Loading/Loading";
import { T_USERDATA } from "../../types";
import PastTests from "./children/PastTests/PastTests";
import { useAuthCtx } from "../../contexts/AuthProvider";
import usePastTestsQuery from "../../queries/pastTests";

interface IProps {
	userData: T_USERDATA;
}

const Home: React.FC<IProps> = (props) => {
	const auth = useAuthCtx();

	const { isSuccess, isPending, isFetching, data } = usePastTestsQuery(auth);

	if (isPending) {
		return <Loading />;
	} else if (!isFetching && isSuccess && data && data !== undefined) {
		return (
			<div className={styles.root}>
				<div className={styles.scroll}>
					<div className={styles.info}>
						<div>
							{props.userData.first_name} {props.userData.last_name}
						</div>
						<div>{props.userData.username}</div>
					</div>
					<PastTests sessions={data} />
				</div>
			</div>
		);
	} else return <div>Error</div>;
};

export default Home;
