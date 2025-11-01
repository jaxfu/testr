import { type T_TOKENS } from "../types";
import { LOCAL_STORAGE_KEYS } from "./consts";

export function deepCopyObject<T extends Object>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
}

// Login
export function logoutUser(
	setUserIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
): void {
	clearTokensFromLocalStorage();
	setUserIsLoggedIn(false);
}

// Storage
export function areTokensInLocalStorage(): boolean {
	return (
		localStorage.getItem(LOCAL_STORAGE_KEYS.access_token) !== null &&
		localStorage.getItem(LOCAL_STORAGE_KEYS.refresh_token) !== null &&
		localStorage.getItem(LOCAL_STORAGE_KEYS.access_token) !== "" &&
		localStorage.getItem(LOCAL_STORAGE_KEYS.refresh_token) !== ""
	);
}

export function getUserSessionDataFromStorage(): T_TOKENS | undefined {
	if (!areTokensInLocalStorage()) return undefined;

	const result = localStorage.getItem(LOCAL_STORAGE_KEYS.refresh_token);
	if (!result) return undefined;

	return {
		access_token: result,
		refresh_token: result,
	};
}

export function sendTokensToLocalStorage(userDataTokens: T_TOKENS) {
	localStorage.setItem(
		LOCAL_STORAGE_KEYS.access_token,
		userDataTokens.access_token,
	);
	localStorage.setItem(
		LOCAL_STORAGE_KEYS.refresh_token,
		userDataTokens.refresh_token,
	);
}

export function clearTokensFromLocalStorage() {
	localStorage.removeItem(LOCAL_STORAGE_KEYS.access_token);
	localStorage.removeItem(LOCAL_STORAGE_KEYS.refresh_token);
}
