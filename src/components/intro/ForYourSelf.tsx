import MiColoredOverlay from "../helper/layout/MiColoredOverlay";
import styles from "../helper/layout/styling/intro/index.module.css";

import MiIntroSlideVector2 from "../helper/layout/svgs/MiIntroSlideVector2";
import MiPagination from "../helper/layout/MiPagination";
import {
  MiIntroActionsButton,
  MiIntroActionsContainer,
  MiIntroSkipButton,
  MiIntroTitle,
} from "../pages/intro/Intro";
import { useAppDispatch } from "../../redux/hooks";
import { setPage } from "../../redux/slices/app/introSlice";
const ForYourSelf = () => {
  const dispatch = useAppDispatch();
  return (
    <div className={styles["embla__slide"]}>
      <MiColoredOverlay color="light-orange" center={true}>
        <MiIntroSlideVector2 />
        <MiIntroTitle>
          for yourself, <br />
          or for another
        </MiIntroTitle>

        <MiIntroActionsContainer>
          <MiPagination />
          <MiIntroActionsButton>Instructions</MiIntroActionsButton>

          <MiIntroSkipButton onClick={() => dispatch(setPage(-1))}>
            Skip
          </MiIntroSkipButton>
        </MiIntroActionsContainer>
      </MiColoredOverlay>
    </div>
  );
};

export default ForYourSelf;
