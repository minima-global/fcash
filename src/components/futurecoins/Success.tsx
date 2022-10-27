import { Button, Stack } from "@mui/material";
import styles from "../styling/futurepage/index.module.css";
import MiFutureCoinSuccess from "../svgs/MiFutureCoinSuccess";
import { MiHeader, MiContent } from "../helper/layout/MiOverlay";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import {
  selectPageSelector,
  updatePage,
} from "../../redux/slices/app/futureCoinSlice";

const MiSuccess = () => {
  const dispatch = useAppDispatch();
  const selectPage = useAppSelector(selectPageSelector);
  return (
    <div className={styles["white-overlay"]}>
      <Stack
        className={styles["content"]}
        alignItems="center"
        justifyContent="center"
      >
        <MiFutureCoinSuccess />
        <MiHeader>
          Funds successfully <br />
          collected
        </MiHeader>
        <MiContent>
          Your funds have now been unlocked <br />
          and your spendable balance has been <br />
          updated in your wallet
        </MiContent>
        <Button
          onClick={() => {
            dispatch(updatePage(selectPage.page - 1));
          }}
          color="secondary"
          fullWidth
          variant="contained"
        >
          Close
        </Button>
      </Stack>
    </div>
  );
};

export default MiSuccess;
