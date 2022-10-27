import MyEnhancedTransitionalFormHandler from "../forms/FormFutureCash";
import MiCard from "../helper/layout/MiCard";

import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectPageSelector } from "../../redux/slices/app/sendFormSlice";
import { selectBalance } from "../../redux/slices/minima/balanceSlice";

const initialFormValues = {
  initialToken: undefined, // Minima
  initialTime: moment(new Date().getTime()).add(moment.duration(5, "minutes")), // always add 5 mins on first launch
};
const Send = () => {
  const dispatch = useAppDispatch();
  const sendFormSelector = useAppSelector(selectPageSelector);

  const wallet = useAppSelector(selectBalance);

  return (
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
  );
};

export default Send;