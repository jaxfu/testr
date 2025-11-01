import { useRef } from "react";
import styles from "./Landing.module.scss";
import { Link } from "react-router-dom";

const Landing: React.FC = () => {
	const rootRef = useRef<HTMLDivElement>(null);
	const scrollRef = useRef<HTMLDivElement>(null);

	return (
		<div className={styles.root} ref={rootRef}>
			<div className={styles.scroll} ref={scrollRef}>
				<div className={styles.words}>
					<div>
						Help your students <span className={styles.accent}>master</span>{" "}
						math.
					</div>
				</div>

				<div className={styles.get_started}>
					<Link to={"/register"} className="link">
						<div>Get Started</div>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Landing;
