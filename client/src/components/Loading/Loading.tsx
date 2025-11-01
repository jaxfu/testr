import styles from "./Loading.module.scss";
import { Oval } from "react-loader-spinner";

const Loading: React.FC = () => {
	return (
		<div className={styles.root}>
			<Oval color="#03cffc" secondaryColor="blue" />
		</div>
	);
};

export default Loading;
