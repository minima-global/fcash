import { Button, Stack } from "@mui/material";
import MiFutureCoinSuccess from "../helper/layout/svgs/MiFutureCoinSuccess";
import { MiHeader, MiContent } from "../helper/layout/MiOverlay";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import {
  selectPageSelector,
  updatePage,
} from "../../redux/slices/app/futureCoinSlice";
import MiColoredOverlay from "../helper/layout/MiColoredOverlay";

const MiSuccess = () => {
  const dispatch = useAppDispatch();
  const selectPage = useAppSelector(selectPageSelector);
  return (
    <MiColoredOverlay color="white">
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
    </MiColoredOverlay>
  );
};

export default MiSuccess;
