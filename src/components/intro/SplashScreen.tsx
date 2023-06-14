import React from "react";
import { Stack } from "@mui/material";
import MiColoredOverlay from "../helper/layout/MiColoredOverlay";
import MiFutureCashIcon from "../helper/layout/svgs/MiFutureCashIcon";
import MiFutureCashIconRight from "../helper/layout/svgs/MiFutureCashIconRight";
import Grid from "../Grid";
import styles from "./Intro.module.css";

const SplashScreen = () => {
  return (
    <div className={styles["splash-screen"]}>
      <Grid
        header={<></>}
        content={
          <div className={styles["brand"]}>
            <MiFutureCashIcon />
            <MiFutureCashIconRight />
          </div>
        }
        footer={<></>}
      ></Grid>
    </div>
  );
};

export default SplashScreen;
