import styles from "./Post.module.scss";
import type { T_QUESTION_RESULT } from "../../../../types/questions";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
	E_GAME_LIMIT_TYPES,
	E_GAME_STATUS,
	T_GAME_SETTINGS,
} from "../../../../types/game";
import UIHandlers from "../../../../utils/uiHandlers";
import { FaRedoAlt, FaPlus } from "react-icons/fa";
import Locals from "./Locals";
import { useAuthCtx } from "../../../../contexts/AuthProvider";

interface IProps {
	results: T_QUESTION_RESULT[];
	time: number;
	gameSettings: { curr: T_GAME_SETTINGS };
	gameStatus: {
		curr: E_GAME_STATUS;
		set: React.Dispatch<React.SetStateAction<E_GAME_STATUS>>;
	};
	currentQuestionIndex: {
		curr: number;
		set: React.Dispatch<React.SetStateAction<number>>;
	};
	timeInSeconds: {
		curr: number;
		set: React.Dispatch<React.SetStateAction<number | null>>;
	};
	restartGame: () => void;
	resetQuestions: () => void;
}

const Post: React.FC<IProps> = (props) => {
	const [sent, setSent] = useState<boolean>(false);

	const correctCount = props.results.filter(({ correct }) => correct).length;
	const questionsCount = props.results.length;
	const score = Math.round((correctCount / questionsCount) * 100);
	const limitType = props.gameSettings.curr.limit_type;
	const time =
		limitType === E_GAME_LIMIT_TYPES.TIME
			? props.gameSettings.curr.limit_amount
			: props.time;

	const auth = useAuthCtx();
	const queryClient = useQueryClient();
	const submitGamesessionMutation = Locals.useSubmitGamesessionMutation(
		queryClient,
		setSent,
	);

	// submit on page load
	useEffect(() => {
		!sent &&
			submitGamesessionMutation.mutate({
				tokens: auth.tokens.curr,
				session: {
					questions_count: questionsCount,
					correct_count: correctCount,
					score,
					time,
					timestamp: 0,
					...props.gameSettings.curr,
				},
			});
	}, []);

	return (
		<div className={styles.root}>
			<div className={styles.scroll}>
				<div className={styles.info}>
					<div className={styles.score}>
						<h2>{score}%</h2>
					</div>
					<div className={styles.ratio}>
						<h3>
							{correctCount}/{questionsCount}
						</h3>
					</div>
					<div className={styles.time}>
						<h3>{UIHandlers.formatTime(time)}</h3>
					</div>
				</div>

				<div className={styles.results}>
					{props.results
						.filter(({ correct }) => !correct)
						.map((result) => {
							return (
								<div key={`question-${result.id}`} className={styles.incorrect}>
									<div>#{result.id}</div>
									<div>
										{result.operands[0]}{" "}
										{UIHandlers.convertOperatorToDisplay(result.operator)}{" "}
										{result.operands[1]} = {result.answer}
									</div>
									<div>{result.guess}</div>
								</div>
							);
						})}
				</div>

				<div className={styles.buttons}>
					<div className={styles.box}>
						<div className={styles.button} onClick={props.restartGame}>
							<FaRedoAlt className={styles.icon} />
						</div>
						Play Again
					</div>
					<div className={styles.box}>
						<div
							className={styles.button}
							onClick={() => {
								props.resetQuestions();
								props.gameStatus.set(E_GAME_STATUS.PRE);
							}}
						>
							<FaPlus className={styles.icon} />
						</div>
						New Game
					</div>
				</div>
			</div>
		</div>
	);
};

export default Post;
