import styles from "./Active.module.scss";
import type { T_QUESTION } from "../../../../types/questions";
import { useEffect, useRef, useState } from "react";
import UIHandlers from "../../../../utils/uiHandlers";
import {
	E_GAME_LIMIT_TYPES,
	E_GAME_STATUS,
	type T_GAME_SETTINGS,
} from "../../../../types/game";
import { useAuthCtx } from "../../../../contexts/AuthProvider";
import useUserDataQuery from "../../../../queries/userDataQuery";

interface IProps {
	questions: T_QUESTION[];
	userGuesses: React.MutableRefObject<number[]>;
	gameSettings: { curr: T_GAME_SETTINGS };
	vertical: boolean;
	gameStatus: {
		set: React.Dispatch<React.SetStateAction<E_GAME_STATUS>>;
	};
	currentQuestionIndex: {
		curr: number;
		set: React.Dispatch<React.SetStateAction<number>>;
	};
	timeInSeconds: {
		curr: number;
		set: React.Dispatch<React.SetStateAction<number>>;
	};
}

const Active: React.FC<IProps> = (props) => {
	const [inputErr, setInputErr] = useState<boolean>(false);
	const [vertical, setVertical] = useState<boolean>(false);

	const currQuestion = props.questions[props.currentQuestionIndex.curr - 1];
	const inputRef = useRef<HTMLInputElement>(null);
	const rootRef = useRef<HTMLDivElement>(null);

	const limitType = props.gameSettings.curr.limit_type;

	const authCtx = useAuthCtx();
	const userDataQuery = useUserDataQuery(authCtx);
	const savedVerticalPref = useRef<boolean>(false);

	// focus on input box on page load
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, [inputRef]);

	// reset input value and err on new question load
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.value = "";
			inputErr && setInputErr(false);
		}
	}, [props.currentQuestionIndex.curr]);

	// setup timer
	useEffect(() => {
		const interval = setInterval(() => {
			props.timeInSeconds.set((prevSeconds) =>
				limitType === E_GAME_LIMIT_TYPES.TIME
					? prevSeconds - 1
					: prevSeconds + 1,
			);
		}, 1000);

		// clean up on unmount
		return () => clearInterval(interval);
	}, []);

	// check for end of game if using time limits
	useEffect(() => {
		if (limitType === E_GAME_LIMIT_TYPES.TIME && props.timeInSeconds.curr < 1) {
			props.gameStatus.set(E_GAME_STATUS.POST);
		}
	}, [props.timeInSeconds]);

	// set vertical on page load
	useEffect(() => {
		if (userDataQuery.isSuccess) {
			savedVerticalPref.current = userDataQuery.data.user_data.vertical;
			setVertical(userDataQuery.data.user_data.vertical);
		}
	}, [userDataQuery.isSuccess]);

	// set up window resize listener for disabling vertical mode
	useEffect(() => {
		function checkResizeForVerticalEligibility() {
			if (rootRef.current) {
				if (rootRef.current.clientWidth < 800 && vertical) {
					setVertical(false);
				} else if (
					rootRef.current.clientWidth >= 800 &&
					vertical !== savedVerticalPref.current
				) {
					setVertical(savedVerticalPref.current);
				}
			}
		}
		window.addEventListener("resize", checkResizeForVerticalEligibility);

		return () =>
			window.removeEventListener("resize", checkResizeForVerticalEligibility);
	}, [vertical]);

	return (
		<div
			className={`${styles.root} ${vertical ? styles.vertical : ""}`}
			ref={rootRef}
		>
			<div className={styles.scroll}>
				<div className={styles.container}>
					<div className={styles.info}>
						<div className={styles.number}>
							{props.currentQuestionIndex.curr}
							{limitType === E_GAME_LIMIT_TYPES.COUNT &&
								`/${props.gameSettings.curr.limit_amount}`}
						</div>
						<div
							className={styles.timer}
							style={{
								color:
									props.timeInSeconds.curr < 10 &&
									limitType === E_GAME_LIMIT_TYPES.TIME
										? "red"
										: "",
							}}
						>
							{UIHandlers.formatTime(props.timeInSeconds.curr)}
						</div>
					</div>

					<div className={styles.content}>
						<div className={styles.top}>
							<div className={styles.left}>
								<h2>{currQuestion.operands[0]}</h2>
							</div>
							<div className={styles.middle}>
								<h2>
									{UIHandlers.convertOperatorToDisplay(currQuestion.operator)}
								</h2>
							</div>
							<div className={styles.right}>
								<h2>{currQuestion.operands[1]}</h2>
							</div>
						</div>
						<div className={styles.bottom}>
							<input
								className={inputErr ? styles.err : ""}
								type="number"
								name="userAnswer"
								ref={inputRef}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										// submit answer
										if (inputRef.current?.value !== "") {
											props.userGuesses.current.push(
												e.currentTarget.valueAsNumber,
											);

											// if last question set gameState to 'post' else increase index
											if (
												limitType === E_GAME_LIMIT_TYPES.COUNT &&
												props.currentQuestionIndex.curr >=
													props.gameSettings.curr.limit_amount
											) {
												props.gameStatus.set(E_GAME_STATUS.POST);
											} else {
												props.currentQuestionIndex.set((curr) => curr + 1);
											}
										} else setInputErr(true);
									}
								}}
								onChange={() => inputErr && setInputErr(false)}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Active;
