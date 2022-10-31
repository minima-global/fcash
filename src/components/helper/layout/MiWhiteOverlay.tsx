import { Stack } from "@mui/system";
import styles from "./styling/WhiteOverlay.module.css";

const MiWhiteOverlay = ({ children }: any) => {
  return (
    <div className={styles["white-overlay"]}>
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
