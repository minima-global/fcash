import { withFormik, FormikProps } from "formik";
import { useAppSelector } from "../../../redux/hooks";

import {
  createBlockTime,
  getFutureCashScriptAddress,
  getBlockDifference,
} from "../../../minima/rpc-commands";
import TokenTimeSelection from "./TokenTimeSelection/TokenTimeSelection";
import Confirmation from "./Confirmation";
import Success from "./Success";
import * as yup from "yup";
import { AppDispatch } from "../../../redux/store";
import {
  selectPageSelector,
  updatePage,
} from "../../../redux/slices/app/sendFormSlice";
import { MinimaToken } from "../../../minima/@types/minima";
import Decimal from "decimal.js";
import Pending from "./Pending/Pending";

import * as RPC from "../../../minima/commands";
import { isDate } from "date-fns";

Decimal.set({ precision: 64 });
const formValidation = yup.object().shape({
  token: yup.object().required("Field is required."),
  datetime: yup
    .date()
    .required("Field is required")
    .typeError("Select a valid date and time")
    .test("datetime-check", "Invalid date", function (val) {
      const { path, createError } = this;

      if (val === undefined) {
        return false;
      }

      if (!isDate(val)) {
        return createError({ path, message: "Please select a valid date" });
      }

      return createBlockTime(val)
        .then(() => {
          return true;
        })
        .catch((err) => {
          return createError({
            path,
            message: err.message,
          });
        });
    }),
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

      if (val == undefined) {
        return false;
      }

      const selectedToken = parent.token;
      if (new Decimal(selectedToken.sendable).lessThan(new Decimal(0.0))) {
        const requiredAmount = new Decimal(val).minus(
          new Decimal(selectedToken.sendable)
        );

        return createError({
          path,
          message: `Insufficient funds, you need another ${requiredAmount.toString()} ${
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
  burn: yup.string().matches(/^[^a-zA-Z\\;'"]+$/, "Invalid characters."),
});
interface FormValues {
  token?: MinimaToken;
  datetime: any;
  address: string;
  amount: string;
  burn: string;
  password: string;
}

const TransitionalFormHandler = (props: FormikProps<FormValues>) => {
  const { handleSubmit } = props;
  const sendFormSelector = useAppSelector(selectPageSelector);

  const formTransition = [
    <TokenTimeSelection {...props} />,
    <Confirmation {...props} />,
    <Success {...props} />,
    <Pending {...props} />,
  ];

  return (
    <form onSubmit={handleSubmit}>{formTransition[sendFormSelector.page]}</form>
  );
};

interface MyEnhancedFutureCashFormProps {
  initialToken: MinimaToken;
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
    datetime: null,
    preferred: false,
    address: "",
    amount: "",
    burn: "",
    password: "",
    dispatch: {},
  }),
  enableReinitialize: false,
  handleSubmit: async (
    dt,
    { props, setSubmitting, setFieldError, setStatus }
  ) => {
    setStatus(undefined);
    try {
      if (!isDate(dt.datetime)) throw new Error("Please enter a valid date..");

      const blocktime = await createBlockTime(dt.datetime);
      const scriptAddress = await getFutureCashScriptAddress();
      const difference = await getBlockDifference(blocktime);
      const stateVars = [
        { port: 1, data: blocktime },
        { port: 2, data: dt.address },
        { port: 3, data: dt.datetime.valueOf() },
        { port: 4, data: difference },
      ];

      if (dt.token == undefined) {
        return setFieldError("token", "Please select a token");
      }

      await RPC.createFutureCashTransaction(
        dt.amount,
        scriptAddress,
        dt.token.tokenid,
        stateVars,
        dt.password.length ? dt.password : false,
        dt.burn.length ? dt.burn : false
      );

      props.dispatch(updatePage(props.page + 1));
    } catch (err: any) {
      // console.log("formError", err);

      if (
        err === "pending" ||
        (err && err.message && err.message === "pending")
      ) {
        return props.dispatch(updatePage(props.page + 2));
      }

      const errorMessageInsufficient =
        err && err.message && err.message.includes("No Coins of");

      setSubmitting(false);

      if (errorMessageInsufficient) {
        return setStatus("Insufficient funds.");
      }

      setStatus(err && err.message ? err.message : err);
    }
  },
  displayName: "FutureCash",
})(TransitionalFormHandler);

export default MyEnhancedTransitionalFormHandler;
