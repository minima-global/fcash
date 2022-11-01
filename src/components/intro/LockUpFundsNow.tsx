import MiColoredOverlay from "../helper/layout/MiColoredOverlay";
import styles from "../helper/layout/styling/intro/index.module.css";
import styled from "@emotion/styled";
import MiIntroSlideVector1 from "../helper/layout/svgs/MiIntroSlideVector1";
import MiPagination from "../helper/layout/MiPagination";

const MiIntroTitle = styled("div")`
  font-family: Manrope-regular;
  font-weight: 700;
  font-size: 2rem;
  line-height: 40px;
  margin-top: 40px;
  text-align: center;
  letter-spacing: 0.02em;

  color: #ffffff;
`;

const LockUpFundsNow = () => {
  return (
    <div className={styles["embla__slide"]}>
      <MiColoredOverlay color="light-orange" center={true}>
        <MiIntroSlideVector1 />
        <MiIntroTitle>
          Lock up <br />
          funds now
        </MiIntroTitle>

        <MiPagination />
      </MiColoredOverlay>
    </div>
  );
};

export default LockUpFundsNow;
