import { APP_VERSION } from "../../../../utils/consts";
import styles from "./VersionLabel.module.scss";

const VersionLabel: React.FC = () => {
	return <span className={styles.root}>v{APP_VERSION}</span>;
};

export default VersionLabel;
