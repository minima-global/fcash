import React from "react";
import { Box } from "@mui/material";

import ForYourSelf from "../../../intro/ForYourSelf";
import LockUpFundsNow from "../../../intro/LockUpFundsNow";
import ToSaveInvestSecure from "../../../intro/ToSaveInvestSecure";
import UnlockTheFuture from "../../../intro/UnlockTheFuture";

import styles from "./MiCarousel.module.css";

const MiSwipeableCarousel = () => {
  const ref = React.useRef<any>();

  const handleScroll = React.useCallback((evt: any) => {
    // console.log("scrolling", evt);
  }, []);
  React.useEffect(() => {
    const div = ref.current;
    if (div) {
      div.addEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return (
    <Box ref={ref} className={styles["carousel__container"]}>
      <ul className={styles["carousel__wrapper"]}>
        <li className={styles["slide"]} id="audi">
          <LockUpFundsNow />
        </li>
        <li className={styles["slide"]} id="ferrari">
          <ForYourSelf />
        </li>
        <li className={styles["slide"]} id="lamborghini">
          <ToSaveInvestSecure />
        </li>
        <li className={styles["slide"]} id="bmw">
          <UnlockTheFuture />
        </li>
      </ul>
    </Box>
  );
};

export default MiSwipeableCarousel;
