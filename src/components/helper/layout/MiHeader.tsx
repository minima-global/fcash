import { Typography, Stack } from "@mui/material";

import styles from "./styling/Header.module.css";
const MiHeader = () => {
  return (
    <>
      <header>
        <Stack>
          <h6 className={styles["font"]}>FutureCash</h6>
        </Stack>
      </header>
    </>
  );
};

export default MiHeader;
