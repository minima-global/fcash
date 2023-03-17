import MyEnhancedTransitionalFormHandler from "../../forms/sendForm/FormFutureCash";
import MiCard from "../../helper/layout/MiCard";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectPageSelector } from "../../../redux/slices/app/sendFormSlice";
import { selectBalance } from "../../../redux/slices/minima/balanceSlice";
import { CircularProgress, Stack } from "@mui/material";

const Send = () => {
  const dispatch = useAppDispatch();
  const wallet = useAppSelector(selectBalance);
  const sendFormSelector = useAppSelector(selectPageSelector);

  return (
    <>
      {wallet && !!wallet.length && (
        <MiCard
          children={
            <MyEnhancedTransitionalFormHandler
              initialToken={wallet[0]}
              dispatch={dispatch}
              page={sendFormSelector.page}
            />
          }
        />
      )}

      {wallet && !wallet.length && (
        <CircularProgress size={24} color="inherit" />
      )}
    </>
  );
};

export default Send;
