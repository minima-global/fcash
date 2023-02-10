import styles from "../helper/layout/styling/intro/index.module.css";
import MiIntroSlideVector2 from "../helper/layout/svgs/MiIntroSlideVector2";

import { MiIntroTitle } from "../pages/intro/Intro";

const ForYourSelf = () => {
  return (
    <div className={styles["embla__slide"]}>
      <MiIntroSlideVector2 />
      <MiIntroTitle>
        for yourself, <br />
        or for another
      </MiIntroTitle>
    </div>
  );
};

export default ForYourSelf;
