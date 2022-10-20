import React from "react";
import { Stack } from "@mui/material";
import { withFormik, FormikProps } from "formik";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import moment from "moment";
import {
  createBlockTime,
  getFutureCashScriptAddress,
  sendFutureCash,
} from "../../minima/rpc-commands";
import TokenTimeSelection from "./sendForm/TokenTimeSelection";
import AddressAmountSelection from "./sendForm/AddressAmountSelection";
import Confirmation from "./sendForm/Confirmation";
import Success from "./sendForm/Success";
import * as yup from "yup";
import { showToast } from "../../redux/slices/app/toastSlice";
import { AppDispatch } from "../../redux/store";
import {
  selectPageSelector,
  updatePage,
} from "../../redux/slices/app/sendFormSlice";

const formValidation = yup.object().shape({
  tokenid: yup.string().trim().required("Field is required."),
  datetime: yup.object().required("Field is required"),
  address: yup
    .string()
    .required("Field is required.")
    .matches(/0|M[xX][0-9a-zA-Z]+/, "Invalid Address.")
    .min(59, "Invalid Address, too short.")
    .max(66, "Invalid Address, too long."),
  amount: yup
    .string()
    .required("Field is required")
    .matches(/^[^a-zA-Z\\;'"]+$/, "Invalid characters."),
  // burn:     yup.string()
  //              .matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters.'),
});
interface FormValues {
  tokenid: string;
  datetime: moment.Moment;
  address: string;
  amount: string;
}

const TransitionalFormHandler = (props: FormikProps<FormValues>) => {
  const { handleSubmit } = props;
  const sendFormSelector = useAppSelector(selectPageSelector);
  const formTransition = [
    <TokenTimeSelection {...props} />,
    <AddressAmountSelection {...props} />,
    <Confirmation {...props} />,
    <Success {...props} />,
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} mb={2}>
        {formTransition[sendFormSelector.page]}
      </Stack>
    </form>
  );
};

interface MyEnhancedFutureCashFormProps {
  initialTokenid: string;
  initialTime: moment.Moment;
  dispatch: AppDispatch;
  page: number;
}
const MyEnhancedTransitionalFormHandler = withFormik<
  MyEnhancedFutureCashFormProps,
  FormValues
>({
  validationSchema: formValidation,
  mapPropsToValues: (props) => ({
    tokenid: props.initialTokenid,
    datetime: props.initialTime,
    address: "",
    amount: "",
    dispatch: {},
  }),
  handleSubmit: async (dt, { props, setSubmitting }) => {
    try {
      const blocktime = await createBlockTime(dt.datetime);
      const scriptAddress = await getFutureCashScriptAddress();

      await sendFutureCash({
        amount: dt.amount,
        scriptAddress: scriptAddress,
        tokenid: dt.tokenid,
        state1: blocktime,
        state2: dt.address,
      });

      props.dispatch(updatePage(props.page + 1));
    } catch (err) {
      props.dispatch(showToast(`${err}`, "warning", ""));

      setSubmitting(false);

      return;
    }

    props.dispatch(showToast(`You sent cash to the future!!!!`, "success", ""));
  },
  displayName: "FutureCash",
})(TransitionalFormHandler);

export default MyEnhancedTransitionalFormHandler;
