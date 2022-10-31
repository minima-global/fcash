import { Stack } from "@mui/system";
import styles from "./styling/WhiteOverlay.module.css";

const MiWhiteOverlay = ({ children, center }: any) => {
  return (
    <div className={styles[`white-overlay${center ? "-center" : null}`]}>
      <Stack
        className={styles["content"]}
        alignItems="center"
        justifyContent="center"
      >
        {children}
      </Stack>
    </div>
  );
};

export default MiWhiteOverlay;
