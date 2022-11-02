import { Stack } from "@mui/material";
import { useAppDispatch } from "../../../redux/hooks";
import { updateDisplayChainHeight } from "../../../redux/slices/minima/statusSlice";

import styles from "./styling/Header.module.css";
import MiHeaderBlockStatus from "./svgs/MiHeaderBlockStatus";
import MiHeaderOptions from "./svgs/MiHeaderOptions";
const MiHeader = () => {
  const dispatch = useAppDispatch();

  const toggleBlockHeightComponent = () => {
    dispatch(updateDisplayChainHeight(true));
  };

  return (
    <>
      <header>
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          className={styles["content"]}
        >
          <h6 className={styles["font"]}>FutureCash</h6>
          <Stack
            flexDirection="row"
            alignItems="center"
            className={styles["actions"]}
          >
            <MiHeaderBlockStatus onClickHandler={toggleBlockHeightComponent} />
            <MiHeaderOptions />
          </Stack>
        </Stack>
      </header>
    </>
  );
};

export default MiHeader;
