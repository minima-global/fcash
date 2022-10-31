import MyEnhancedTransitionalFormHandler from "../../forms/sendForm/FormFutureCash";
import MiCard from "../../helper/layout/MiCard";

import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectPageSelector } from "../../../redux/slices/app/sendFormSlice";
import { selectBalance } from "../../../redux/slices/minima/balanceSlice";
import { CircularProgress } from "@mui/material";

const initialFormValues = {
  initialToken: undefined, // Minima
  initialTime: moment(new Date().getTime()).add(moment.duration(5, "minutes")), // always add 5 mins on first launch
};
const Send = () => {
  const dispatch = useAppDispatch();

  const sendFormSelector = useAppSelector(selectPageSelector);

  const wallet = useAppSelector(selectBalance);
  console.log("Wallet has changed", wallet);

  return (
    <>
      {wallet && wallet.length > 0 ? (
        <MiCard
          children={
            <MyEnhancedTransitionalFormHandler
              initialTime={initialFormValues.initialTime}
              initialToken={wallet[0]}
              dispatch={dispatch}
              page={sendFormSelector.page}
            />
          }
        />
      ) : (
        <CircularProgress size={24} color="inherit" />
      )}
    </>
  );
};

export default Send;