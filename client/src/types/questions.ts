import { deepCopyObject } from "../utils/methods";
import { T_GAME_SETTINGS, E_OPERATIONS, T_OPERATIONS } from "./game";

export type T_QUESTION = {
	id: number;
	operands: number[];
	operator: E_OPERATIONS;
	answer: number;
};
export const INIT_QUESTION: T_QUESTION = {
	id: -1,
	operands: [0, 0],
	operator: E_OPERATIONS.NULL,
	answer: 0,
};

export type T_QUESTION_RESULT = T_QUESTION & {
	guess: number;
	correct: boolean;
};
export const INIT_QUESTION_RESULT: T_QUESTION_RESULT = {
	...INIT_QUESTION,
	guess: 0,
	correct: false,
};

export function generateQuestions(
	settings: T_GAME_SETTINGS,
	count: number,
	currentQuestionCount: number,
): T_QUESTION[] {
	const questions: T_QUESTION[] = [];
	const initQuestion = deepCopyObject(INIT_QUESTION);

	for (let i = 1; i <= count; i++) {
		questions.push(
			// if first question, pass initQuestion as prev
			generateQuestion(
				i === 1 ? initQuestion : questions[i - 2],
				settings,
				i + currentQuestionCount,
			),
		);
	}

	return questions;
}

export function generateQuestion(
	prev: T_QUESTION,
	settings: T_GAME_SETTINGS,
	id: number,
): T_QUESTION {
	const question = deepCopyObject(INIT_QUESTION);

	while (true) {
		const operands = [0, 0]
			.map((_) => randomInRange(settings.min, settings.max))
			.sort();
		const { add, sub, mult, div } = settings;
		const operations = convertOperationsObjectToArray({ add, sub, mult, div });
		const operator = operations[randomInRange(0, operations.length - 1)];

		question.operands = operands;
		question.operator = operator;
		question.answer = calculateQuestionResult(operands, operator);
		question.id = id;

		if (
			question.operands.join("") === prev.operands.join("") &&
			question.operator === prev.operator
		) {
			continue;
		} else break;
	}

	return question;
}

function convertOperationsObjectToArray(ops: T_OPERATIONS): E_OPERATIONS[] {
	const arr: E_OPERATIONS[] = [];

	Object.entries(ops).forEach(([_, value], i) => {
		value && arr.push(i);
	});

	return arr.sort();
}

function calculateQuestionResult(
	operands: number[],
	operator: E_OPERATIONS,
): number {
	const [a, b] = operands;
	switch (operator) {
		case E_OPERATIONS.ADD:
			return a + b;
		case E_OPERATIONS.SUB:
			return a - b;
		case E_OPERATIONS.MULT:
			return a * b;
		case E_OPERATIONS.DIV:
			return a / b;
	}

	return 0;
}

function randomInRange(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
