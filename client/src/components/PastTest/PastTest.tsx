import styles from "./PastTest.module.scss";
import { type T_GAME_SESSION } from "../../types/game";
import UIHandlers from "../../utils/uiHandlers";
import Locals from "./Locals";

interface IProps {
	session: T_GAME_SESSION;
}

const PastTest: React.FC<IProps> = (props) => {
	return (
		<div className={styles.root}>
			<h2>
				{props.session.timestamp !== undefined &&
					Locals.formatUnixEpoch(props.session.timestamp)}
			</h2>
			<div className={styles.stats}>
				<div className={styles.range}>
					{props.session.min} &lt;-&gt; {props.session.max}
				</div>
				<div>{UIHandlers.formatTime(props.session.time)}</div>
				<div>{props.session.score}%</div>
				<div>
					{props.session.correct_count}/{props.session.questions_count}
				</div>
				<div>{Locals.getDisplayOps(props.session).join(", ")}</div>
			</div>
		</div>
	);
};

export default PastTest;
