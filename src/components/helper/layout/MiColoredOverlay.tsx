import { Stack } from "@mui/material";
import styles from "./styling/ColoredOverlay.module.css";

const MiColoredOverlay = ({ children, center, color }: any) => {
  return (
    <div className={styles[`${color}-overlay${center ? "-center" : ""}`]}>
      {color !== "light-orange" ? (
        <Stack className={styles["content"]}>{children}</Stack>
      ) : (
        children
      )}
    </div>
  );
};

export default MiColoredOverlay;
