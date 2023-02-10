import styles from "../helper/layout/styling/intro/index.module.css";
import MiIntroSlideVector1 from "../helper/layout/svgs/MiIntroSlideVector1";
import { MiIntroTitle } from "../pages/intro/Intro";

const LockUpFundsNow = () => {
  return (
    <div className={styles["mi__slide"]}>
      <MiIntroSlideVector1 />
      <MiIntroTitle>
        Lock up <br />
        funds now
      </MiIntroTitle>
    </div>
  );
};

export default LockUpFundsNow;
