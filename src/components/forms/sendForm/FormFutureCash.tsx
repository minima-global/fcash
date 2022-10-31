import React from "react";
import { Stack } from "@mui/material";
import { withFormik, FormikProps } from "formik";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";

import moment from "moment";
import {
  createBlockTime,
  getFutureCashScriptAddress,
  sendFutureCash,
  getBlockDifference,
} from "../../../minima/rpc-commands";
import TokenTimeSelection from "./TokenTimeSelection";
// import AddressAmountSelection from "./sendForm/AddressAmountSelection";
import Confirmation from "./Confirmation";
import Success from "./Success";
import * as yup from "yup";
import { showToast } from "../../../redux/slices/app/toastSlice";
import { AppDispatch } from "../../../redux/store";
import {
  selectPageSelector,
  updatePage,
} from "../../../redux/slices/app/sendFormSlice";
import { MinimaToken } from "../../../minima/types/minima";
import Decimal from "decimal.js";

const formValidation = yup.object().shape({
  token: yup.object().required("Field is required."),
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
    .matches(/^[^a-zA-Z\\;'"]+$/, "Invalid characters.")
    .test("check-my-funds", "Insufficient funds.", function (val) {
      const { path, createError, parent } = this;
      console.log(path);
      if (val == undefined) {
        return false;
      }

      const selectedToken = parent.token;
      if (new Decimal(selectedToken.sendable).lessThan(new Decimal(val))) {
        const requiredAmount = new Decimal(val).minus(
          new Decimal(selectedToken.sendable)
        );

        return createError({
          path,
          message: `Insufficient funds, you need another ${requiredAmount.toFixed()} ${
            typeof selectedToken.token == "string"
              ? selectedToken.token
              : typeof selectedToken.token == "object" &&
                selectedToken.token.hasOwnProperty("name")
              ? selectedToken.token.name
              : "Unknown"
          } `,
        });
      }

      return true;
    }),
  // burn:     yup.string()
  //              .matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters.'),
});
interface FormValues {
  token: MinimaToken | undefined;
  datetime: moment.Moment;
  address: string;
  amount: string;
}

const TransitionalFormHandler = (props: FormikProps<FormValues>) => {
  const { handleSubmit } = props;
  const sendFormSelector = useAppSelector(selectPageSelector);

  const formTransition = [
    <TokenTimeSelection {...props} />,
    // <AddressAmountSelection {...props} />,
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
  initialToken: MinimaToken;
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
    token: props.initialToken,
    datetime: props.initialTime,
    address: "",
    amount: "",
    dispatch: {},
  }),
  enableReinitialize: false,
  handleSubmit: async (dt, { props, setSubmitting, setFieldError }) => {
    try {
      const blocktime = await createBlockTime(dt.datetime);
      const scriptAddress = await getFutureCashScriptAddress();
      const difference = await getBlockDifference(blocktime);
      console.log("Block difference for @COINAGE:", difference);
      if (dt.token == undefined) {
        setFieldError("token", "Please select a token");
        return;
      }
      await sendFutureCash({
        amount: dt.amount,
        scriptAddress: scriptAddress,
        tokenid: dt.token.tokenid,
        state1: blocktime,
        state2: dt.address,
        state3: dt.datetime.valueOf(),
        state4: difference,
      });

      props.dispatch(updatePage(props.page + 1));
    } catch (err) {
      props.dispatch(showToast(`${err}`, "warning", ""));

      setSubmitting(false);

      return;
    }
  },
  displayName: "FutureCash",
})(TransitionalFormHandler);

export default MyEnhancedTransitionalFormHandler;
