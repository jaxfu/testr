import {
	E_GAME_LIMIT_TYPES,
	type T_GAME_SESSION,
} from "../../../../types/game";
import Locals from "../Locals";
import styles from "./PastTests.module.scss";
import { FaClock, FaQuestionCircle } from "react-icons/fa";

function formatSeconds(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;

	// Add a leading zero to seconds if it's less than 10
	const formattedSeconds =
		remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

	return `${minutes}:${formattedSeconds}`;
}

interface IProps {
	sessions: T_GAME_SESSION[];
}

const PastTests: React.FC<IProps> = (props) => {
	return (
		<section className={styles.root}>
			<div className={styles.scroll}>
				<div className={styles.row} id={styles.headers}>
					<div className={styles.date}>
						<h3>Date</h3>
					</div>
					<div className={styles.score}>
						<h3>Score</h3>
					</div>
					<div className={styles.count}>
						<h3>Count</h3>
					</div>
					<div className={styles.time}>
						<h3>Time</h3>
					</div>
					<div className={styles.limit}>
						<h3>Limit</h3>
					</div>
					<div className={styles.range}>
						<span className={styles.min}>
							<h3>Min</h3>
						</span>
						<span className={styles.max}>
							<h3>Max</h3>
						</span>
					</div>
					<div className={styles.ops}>
						<span>
							<h3>+</h3>
						</span>
						<span>
							<h3>-</h3>
						</span>
						<span>
							<h3>×</h3>
						</span>
						<span>
							<h3>÷</h3>
						</span>
					</div>
				</div>

				{props.sessions.length > 0 ? (
					props.sessions.map((s, i) => {
						return (
							<div className={styles.row} key={`test-${i}`}>
								<div className={styles.date}>
									{s.timestamp !== undefined &&
										Locals.formatUnixEpoch(s.timestamp)}
								</div>
								<div className={styles.score}>{s.score}%</div>
								<div className={styles.count}>
									{s.correct_count}/{s.questions_count}
								</div>
								<div className={styles.time}>{formatSeconds(s.time)}</div>
								<div className={styles.limit}>
									{s.limit_type === E_GAME_LIMIT_TYPES.TIME ? (
										<FaClock />
									) : (
										<FaQuestionCircle />
									)}
								</div>
								<div className={styles.range}>
									<span className={styles.min}>{s.min}</span>
									<span className={styles.max}>{s.max}</span>
								</div>
								<div className={styles.ops}>
									<span className={s.add ? styles.checked : styles.unchecked}>
										{s.add ? "✓" : "x"}
									</span>
									<span className={s.sub ? styles.checked : styles.unchecked}>
										{s.sub ? "✓" : "x"}
									</span>
									<span className={s.mult ? styles.checked : styles.unchecked}>
										{s.mult ? "✓" : "x"}
									</span>
									<span className={s.div ? styles.checked : styles.unchecked}>
										{s.div ? "✓" : "x"}
									</span>
								</div>
							</div>
						);
					})
				) : (
					<div id={styles.empty}>No recent games</div>
				)}
			</div>
		</section>
	);
};

export default PastTests;
