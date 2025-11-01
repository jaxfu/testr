import { type T_GAME_SESSION, E_OPERATIONS } from "../../../types/game";
import UIHandlers from "../../../utils/uiHandlers";

const Locals = {
	formatUnixEpoch(epochSeconds: number): string {
		const date = new Date(epochSeconds * 1000);
		return date.toLocaleString("en-US", {
			year: "2-digit",
			month: "2-digit",
			day: "2-digit",
			hour12: true,
		});
	},
	getDisplayOps(session: T_GAME_SESSION): string[] {
		const out: string[] = [];

		if (session.add) {
			out.push(UIHandlers.convertOperatorToDisplay(E_OPERATIONS.ADD));
		}
		if (session.sub) {
			out.push(UIHandlers.convertOperatorToDisplay(E_OPERATIONS.SUB));
		}
		if (session.mult) {
			out.push(UIHandlers.convertOperatorToDisplay(E_OPERATIONS.MULT));
		}
		if (session.div) {
			out.push(UIHandlers.convertOperatorToDisplay(E_OPERATIONS.DIV));
		}

		return out;
	},
};

export default Locals;
