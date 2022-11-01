import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  selectPageSelector,
  setPage,
} from "../../../redux/slices/app/introSlice";
import ForYourSelf from "../../intro/ForYourSelf";
import LockUpFundsNow from "../../intro/LockUpFundsNow";
import SplashScreen from "../../intro/SplashScreen";
import ToSaveInvestSecure from "../../intro/ToSaveInvestSecure";
import UnlockTheFuture from "../../intro/UnlockTheFuture";

import useEmblaCarousel from "embla-carousel-react";
import styles from "../../helper/layout/styling/intro/index.module.css";
import React from "react";

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
        // console.log(e);

        const currentSlide = emblaApi.selectedScrollSnap();
        console.log("slides", currentSlide);
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
