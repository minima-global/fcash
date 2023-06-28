import MyEnhancedTransitionalFormHandler from "../../forms/sendForm/FormFutureCash";
import MiCard from "../../helper/layout/Card/MiCard";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectPageSelector } from "../../../redux/slices/app/sendFormSlice";
import { selectBalance } from "../../../redux/slices/minima/balanceSlice";
import { CircularProgress } from "@mui/material";

const Send = () => {
  const dispatch = useAppDispatch();
  const wallet = useAppSelector(selectBalance);
  const sendFormSelector = useAppSelector(selectPageSelector);

  return (
    <>
      {wallet && !!wallet.length && (
        <MiCard
          extraClass="align-self-start"
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
