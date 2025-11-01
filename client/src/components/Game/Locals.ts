import type { T_QUESTION, T_QUESTION_RESULT } from "../../types/questions";

const Locals = {
	generateResults(
		guesses: number[],
		questions: T_QUESTION[],
	): T_QUESTION_RESULT[] {
		return guesses.map((guess, i) => {
			return {
				...questions[i],
				guess,
				correct: guess === questions[i].answer,
			};
		});
	},
};

export default Locals;
