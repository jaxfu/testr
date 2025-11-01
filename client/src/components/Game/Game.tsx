import { useEffect, useRef, useState } from "react";
import Settings from "./children/Settings/Settings";
import {
	E_GAME_LIMIT_TYPES,
	E_GAME_STATUS,
	type T_GAME_SETTINGS,
} from "../../types/game";
import {
	generateQuestions,
	T_QUESTION_RESULT,
	type T_QUESTION,
} from "../../types/questions";
import Active from "./children/Active/Active";
import Loading from "../Loading/Loading";
import Post from "./children/Post/Post";
import Locals from "./Locals";

const QUESTION_CHUNK_SIZE: number = 10;

interface IProps {
	vertical: boolean;
}

const Game: React.FC<IProps> = (props) => {
	const [gameStatus, setGameStatus] = useState<E_GAME_STATUS>(
		E_GAME_STATUS.PRE,
	);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(1);
	const [questions, setQuestions] = useState<T_QUESTION[]>([]);
	const [timeInSeconds, setTimeInSeconds] = useState<number | null>(null);
	const [questionResults, setQuestionResults] = useState<T_QUESTION_RESULT[]>(
		[],
	);
	const [gameSettings, setGameSettings] = useState<T_GAME_SETTINGS | undefined>(
		undefined,
	);

	const userGuesses = useRef<number[]>([]);

	function startGame(settings: T_GAME_SETTINGS): void {
		setCurrentQuestionIndex(1);
		setGameSettings(settings);
		setGameStatus(E_GAME_STATUS.ACTIVE);
		setTimeInSeconds(() =>
			settings.limit_type === E_GAME_LIMIT_TYPES.TIME
				? settings.limit_amount
				: 0,
		);
	}

	function restartGame() {
		resetQuestions();
		gameSettings && startGame(gameSettings);
	}

	function resetQuestions() {
		setQuestionResults([]);
		setQuestions([]);
		userGuesses.current = [];
	}

	// generate questions on ACTIVE &&
	// generate results on POST
	useEffect(() => {
		if (gameSettings !== undefined) {
			switch (gameStatus) {
				case E_GAME_STATUS.ACTIVE:
					switch (gameSettings.limit_type) {
						case E_GAME_LIMIT_TYPES.COUNT:
							setQuestions((curr) =>
								generateQuestions(
									gameSettings,
									gameSettings.limit_amount,
									curr.length !== undefined ? curr.length : 0,
								),
							);
							break;
						case E_GAME_LIMIT_TYPES.TIME:
							setQuestions((curr) =>
								generateQuestions(
									gameSettings,
									QUESTION_CHUNK_SIZE,
									curr.length !== undefined ? curr.length : 0,
								),
							);
							break;
					}
					break;
				case E_GAME_STATUS.POST:
					setQuestionResults(
						Locals.generateResults(userGuesses.current, questions),
					);
					break;
			}
		}
	}, [gameStatus, gameSettings]);

	// check if more questions need to be generated while in active mode
	useEffect(() => {
		if (
			gameStatus === E_GAME_STATUS.ACTIVE &&
			Math.abs(questions.length - currentQuestionIndex) <= 5 &&
			gameSettings !== undefined &&
			gameSettings.limit_type === E_GAME_LIMIT_TYPES.TIME
		) {
			setQuestions((curr) => {
				curr.push(
					...generateQuestions(
						gameSettings,
						QUESTION_CHUNK_SIZE,
						curr.length !== undefined ? curr.length : 0,
					),
				);
				return curr;
			});
		}
	}, [currentQuestionIndex, gameStatus, gameSettings]);

	switch (gameStatus) {
		case E_GAME_STATUS.PRE:
			return <Settings startGame={startGame} />;
		case E_GAME_STATUS.ACTIVE:
			return gameSettings !== undefined &&
				questions.length > 0 &&
				timeInSeconds !== null ? (
				<Active
					questions={questions}
					userGuesses={userGuesses}
					gameSettings={{ curr: gameSettings }}
					vertical={props.vertical}
					gameStatus={{ set: setGameStatus }}
					currentQuestionIndex={{
						curr: currentQuestionIndex,
						set: setCurrentQuestionIndex,
					}}
					timeInSeconds={{
						curr: timeInSeconds,
						set: setTimeInSeconds as React.Dispatch<
							React.SetStateAction<number>
						>,
					}}
				/>
			) : (
				<Loading />
			);
		case E_GAME_STATUS.POST:
			return questionResults.length > 0 &&
				timeInSeconds !== null &&
				gameSettings !== undefined ? (
				<Post
					results={questionResults}
					time={timeInSeconds}
					gameSettings={{ curr: gameSettings }}
					gameStatus={{ curr: gameStatus, set: setGameStatus }}
					currentQuestionIndex={{
						curr: currentQuestionIndex,
						set: setCurrentQuestionIndex,
					}}
					timeInSeconds={{ curr: timeInSeconds, set: setTimeInSeconds }}
					restartGame={restartGame}
					resetQuestions={resetQuestions}
				/>
			) : (
				<Loading />
			);
	}
};

export default Game;
