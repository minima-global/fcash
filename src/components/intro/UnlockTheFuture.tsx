import MiColoredOverlay from "../helper/layout/MiColoredOverlay";
import styles from "../helper/layout/styling/intro/index.module.css";

import MiIntroSlideVector4 from "../helper/layout/svgs/MiIntroSlideVector4";
import MiPagination from "../helper/layout/MiPagination";
import {
  MiIntroActionsButton,
  MiIntroActionsContainer,
  MiIntroTitle,
} from "../pages/intro/Intro";
import { useNavigate } from "react-router-dom";
const UnlockTheFuture = () => {
  const navigate = useNavigate();
  return (
    <div className={styles["embla__slide"]}>
      <MiColoredOverlay color="light-orange" center={true}>
        <MiIntroSlideVector4 />
        <MiIntroTitle>
          and unlock <br />
          in the future
        </MiIntroTitle>

        <MiIntroActionsContainer>
          <MiPagination />
          <MiIntroActionsButton onClick={() => navigate("/instructions")}>
            Instructions
          </MiIntroActionsButton>
        </MiIntroActionsContainer>
      </MiColoredOverlay>
    </div>
  );
};

export default UnlockTheFuture;
