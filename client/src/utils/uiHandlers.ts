import { E_OPERATIONS } from "../types/game";

export const togglePasswordLogin = (
	e: React.MouseEvent<HTMLButtonElement>,
): void => {
	const passwordBox = document.querySelector("#passwordBox");
	if (passwordBox) {
		const type =
			passwordBox.getAttribute("type") === "password" ? "text" : "password";
		passwordBox.setAttribute("type", type);
	}

	const eye3 = document.querySelector("#eye");
	if (eye3) {
		if (eye3.classList.contains("fa-eye-slash")) {
			eye3.classList.remove("fa-eye-slash");
		} else {
			eye3.classList.toggle("fa-eye-slash");
		}
	}
};

export const togglePasswordRegister1 = (
	e: React.MouseEvent<HTMLButtonElement>,
): void => {
	const password1 = document.querySelector("#password1");
	if (password1) {
		const type =
			password1.getAttribute("type") === "password" ? "text" : "password";
		password1.setAttribute("type", type);
	}
	const eye1 = document.querySelector("#eye1");
	if (eye1) {
		if (eye1.classList.contains("fa-eye-slash")) {
			eye1.classList.remove("fa-eye-slash");
		} else {
			eye1.classList.toggle("fa-eye-slash");
		}
	}
};

export const togglePasswordRegister2 = (
	e: React.MouseEvent<HTMLButtonElement>,
): void => {
	const password2 = document.querySelector("#password2");
	if (password2) {
		const type =
			password2.getAttribute("type") === "password" ? "text" : "password";
		password2.setAttribute("type", type);
	}
	const eye2 = document.querySelector("#eye2");
	if (eye2) {
		if (eye2.classList.contains("fa-eye-slash")) {
			eye2.classList.remove("fa-eye-slash");
		} else {
			eye2.classList.toggle("fa-eye-slash");
		}
	}
};

const UIHandlers = {
	convertOperatorToDisplay(op: E_OPERATIONS): string {
		switch (op) {
			case E_OPERATIONS.ADD:
				return String.fromCharCode(0x002b);
			case E_OPERATIONS.SUB:
				return String.fromCharCode(0x2212);
			case E_OPERATIONS.MULT:
				return String.fromCharCode(0x00d7);
			case E_OPERATIONS.DIV:
				return String.fromCharCode(0x00f7);
		}

		return "";
	},
	formatTime(totalSeconds: number): string {
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
	},
	convertUnixTimestamp(timestamp: number): string {
		// Convert the timestamp from seconds to milliseconds
		const date = new Date(timestamp * 1000);

		// Get the month, day, and year
		const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
		const day = date.getDate().toString().padStart(2, "0");
		const year = date.getFullYear();

		// Return the formatted date as mm/dd/yyyy
		return `${month}/${day}/${year}`;
	},
};

export default UIHandlers;
