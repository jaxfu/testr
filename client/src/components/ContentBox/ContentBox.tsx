import NavBar from "../App/children/NavBar/NavBar";
import styles from "./ContentBox.module.scss";
import { useAuthCtx } from "../../contexts/AuthProvider";

interface IProps {
	children: React.ReactNode;
}

const ContentBox: React.FC<IProps> = (props) => {
	const authData = useAuthCtx();

	return (
		<div className={styles.root}>
			{authData.valid && <NavBar />}
			<div className={styles.content}>{props.children}</div>
		</div>
	);
};

export default ContentBox;
