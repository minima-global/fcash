import styles from "../helper/layout/styling/intro/index.module.css";
import MiIntroSlideVector3 from "../helper/layout/svgs/MiIntroSlideVector3";
import { MiIntroTitle } from "../pages/intro/Intro";

const ToSaveInvestSecure = () => {
  return (
    <div className={styles["embla__slide"]}>
      <MiIntroSlideVector3 />
      <MiIntroTitle>
        to save, invest <br />
        or secure
      </MiIntroTitle>
    </div>
  );
};

export default ToSaveInvestSecure;
