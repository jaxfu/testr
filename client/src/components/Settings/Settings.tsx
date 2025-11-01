import { useQueryClient } from "@tanstack/react-query";
import { useAuthCtx } from "../../contexts/AuthProvider";
import useUserDataQuery from "../../queries/userDataQuery";
import Loading from "../Loading/Loading";
import Locals from "./Locals";
import styles from "./Settings.module.scss";

const Settings: React.FC = () => {
	const queryClient = useQueryClient();
	const authCtx = useAuthCtx();
	const userDataQuery = useUserDataQuery(authCtx);
	const updateVerticalPrefMutation = Locals.useUpdateVerticalPrefMutation(
		queryClient,
		authCtx.tokens.curr,
	);

	if (userDataQuery.isFetching) {
		return <Loading />;
	} else if (userDataQuery.isSuccess && userDataQuery.data !== undefined) {
		return (
			<section className={styles.root}>
				<div className={styles.scroll}>
					<section className={styles.content}>
						<div>
							<h1>Settings</h1>
						</div>
						<div>
							<h2>Game</h2>
							<div className={styles.inputs}>
								<div>
									<label htmlFor="vertical">Vertical Layout</label>
									<input
										type="checkbox"
										name="vertical"
										id="vertical"
										defaultChecked={userDataQuery.data.user_data.vertical}
										onChange={(e) =>
											updateVerticalPrefMutation.mutate(e.target.checked)
										}
									/>
								</div>
							</div>
						</div>
					</section>
				</div>
			</section>
		);
	} else alert("Error, please refresh");
};

export default Settings;
