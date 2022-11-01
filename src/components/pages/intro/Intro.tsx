import { useAppDispatch } from "../../../redux/hooks";
import { setPage } from "../../../redux/slices/app/introSlice";
import ForYourSelf from "../../intro/ForYourSelf";
import LockUpFundsNow from "../../intro/LockUpFundsNow";
import ToSaveInvestSecure from "../../intro/ToSaveInvestSecure";
import UnlockTheFuture from "../../intro/UnlockTheFuture";

import useEmblaCarousel from "embla-carousel-react";
import styles from "../../helper/layout/styling/intro/index.module.css";
import React from "react";
import styled from "@emotion/styled";

export const displayIntroPages = [
  <LockUpFundsNow />,
  <ForYourSelf />,
  <ToSaveInvestSecure />,
  <UnlockTheFuture />,
];
const Intro = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (emblaApi) {
      // Embla API is ready
      emblaApi.on("select", (e) => {
        const currentSlide = emblaApi.selectedScrollSnap();
        dispatch(setPage(currentSlide));
      });
    }

    return () => {
      if (emblaApi) {
        emblaApi.off("select", (e) => {
          // console.log("EMBLA, REMOVING LISTENER " + e);
        });
        emblaApi.destroy();
      }
    };
  }, [emblaApi]);

  return (
    <div className={styles["embla"]} ref={emblaRef}>
      <div className={styles["embla__container"]}>
        <LockUpFundsNow />
        <ForYourSelf />
        <ToSaveInvestSecure />
        <UnlockTheFuture />
      </div>
    </div>
  );
};

export default Intro;

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

const MiIntroActionsButton = styled("button")`
  background: #fff;
  color: #363a3f;
  border: none;
  border-radius: 6px;
  height: 54px;
  letter-spacing: 0.02rem;

  font-family: Manrope-regular;
  font-weight: 800;
  font-size: 1.125rem;
  line-height: 21px;
  width: 100%;
  text-align: center;

  cursor: pointer;

  :hover {
    transform: scale(0.989);
    background: rgba(255, 255, 255, 0.99);
  }
`;

const MiIntroSkipButton = styled("div")`
  font-family: Manrope-regular;
  font-style: normal;
  font-weight: 600;
  font-size: 1rem;
  line-height: 30px;
  background: none;
  cursor: pointer;
  text-align: center;
  letter-spacing: 0.02em;
  color: #ffffff;

  :hover {
    transform: scale(0.989);
  }
`;

const MiIntroActionsContainer = styled("div")`
  margin-top: 92px;
  width: 100%;

  > :nth-of-type(1) {
    margin-top: 37px;
  }

  > :nth-of-type(2) {
    margin-top: 8px;
  }
`;

export {
  MiIntroActionsButton,
  MiIntroSkipButton,
  MiIntroTitle,
  MiIntroActionsContainer,
};
