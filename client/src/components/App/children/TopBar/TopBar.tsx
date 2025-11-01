import { useEffect, useState } from "react";
import styles from "./TopBar.module.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import NavBar from "./children/NavBar/NavBar";
import { IoMdExit } from "react-icons/io";
import { QUERY_KEYS } from "../../../../utils/consts";
import { clearTokensFromLocalStorage } from "../../../../utils/methods";
import { useQueryClient } from "@tanstack/react-query";
import { PiMathOperationsBold } from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthCtx } from "../../../../contexts/AuthProvider";

const TopBar: React.FC = () => {
	const authData = useAuthCtx();

	const [navbarIsExpanded, setNavbarIsExpanded] = useState<boolean>(false);

	const queryClient = useQueryClient();

	const location = useLocation();
	const navigate = useNavigate();

	// close navbar if user gets logged out
	useEffect(() => {
		if (!authData.valid) setNavbarIsExpanded(false);
	}, [authData]);

	return (
		<div className={styles.root}>
			<div className={styles.main}>
				<PiMathOperationsBold className={styles.icon} />
				<h1 className={styles.title}>Mathly</h1>

				<div className={styles.right}>
					{authData.valid ? (
						<div className={styles.logged_in}>
							<IoMdExit
								onClick={() => {
									clearTokensFromLocalStorage();
									authData.tokens.set(undefined);
									queryClient.invalidateQueries({
										queryKey: [QUERY_KEYS.USER_DATA],
									});
									navigate("/login");
								}}
								className={styles.logout}
							/>
							<GiHamburgerMenu
								onClick={() => setNavbarIsExpanded((curr) => !curr)}
								className={`${styles.hamburger} ${navbarIsExpanded ? styles.open : ""
									}`}
							/>
						</div>
					) : (
						<>
							{location.pathname !== "/login" && (
								<div className={styles.buttons}>
									<Link to={"/login"} className={"link"}>
										<button>Login</button>
									</Link>
								</div>
							)}
						</>
					)}
				</div>
			</div>

			{navbarIsExpanded && authData.valid && <NavBar />}
		</div>
	);
};

export default TopBar;
