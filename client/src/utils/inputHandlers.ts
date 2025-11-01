export function handleInput(
	e: React.ChangeEvent<HTMLInputElement>,
	callback: React.Dispatch<React.SetStateAction<string>>,
) {
	callback(e.target.value);
}
