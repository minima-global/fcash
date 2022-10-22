import MyEnhancedTransitionalFormHandler from "../forms/FormFutureCash";
import MiCard from "../helper/layout/MiCard";

import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectPageSelector } from "../../redux/slices/app/sendFormSlice";

const initialFormValues = {
  initialTokenid: "0x00", // Minima
  initialTime: moment(new Date().getTime()).add(moment.duration(5, "minutes")), // always add 5 mins on first launch
};
const Send = () => {
  const dispatch = useAppDispatch();
  const sendFormSelector = useAppSelector(selectPageSelector);

  return (
    <MiCard
      children={
        <MyEnhancedTransitionalFormHandler
          initialTime={initialFormValues.initialTime}
          initialTokenid={initialFormValues.initialTokenid}
          dispatch={dispatch}
          page={sendFormSelector.page}
        />
      }
    />
  );
};

export default Send;
