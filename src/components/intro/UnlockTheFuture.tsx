import styles from "../helper/layout/styling/intro/index.module.css";
import MiIntroSlideVector4 from "../helper/layout/svgs/MiIntroSlideVector4";
import { MiIntroTitle } from "../pages/intro/Intro";

const UnlockTheFuture = () => {
  return (
    <div className={styles["embla__slide"]}>
      <MiIntroSlideVector4 />
      <MiIntroTitle>
        and unlock <br />
        in the future
      </MiIntroTitle>
    </div>
  );
};

export default UnlockTheFuture;
