import { Button, TextField } from "@mui/material";
import { InputWrapper, InputLabel } from "./InputWrapper";
import styles from "../../styling/sendForm/TokenSelect.module.css";
import { updatePage } from "../../../redux/slices/app/sendFormSlice";
import { useAppSelector } from "../../../redux/hooks";
import { selectBalance } from "../../../redux/slices/minima/balanceSlice";
import { MinimaToken } from "../../../minima/types/minima";
import React from "react";
import Decimal from "decimal.js";

const AddressAmountSelection = (props: any) => {
  const walletTokens = useAppSelector(selectBalance);
  const {
    values,
    touched,
    errors,
    page,
    handleChange,
    isValid,
    dirty,
    dispatch,
    setFieldError,
  } = props;

  React.useEffect(() => {
    const tkn = walletTokens.find(
      (t: MinimaToken) => t.tokenid == values.tokenid
    );

    if (tkn == undefined) return;

    if (values.amount.length == 0) return;

    try {
      const hasFunds = new Decimal(values.amount).lessThan(
        new Decimal(tkn.sendable)
      );

      if (!hasFunds) {
        console.log(`setting field error`);
        setFieldError("amount", "Insufficient funds!");
      }
    } catch (err) {
      console.error(err);
    }
  }, [values.amount]);

  return (
    <>
      <InputWrapper>
        <InputLabel>Enter a wallet address</InputLabel>
        <TextField
          id="address"
          name="address"
          placeholder="Address"
          onChange={handleChange}
          helperText={touched.address && errors.address}
          error={touched.address && Boolean(errors.address)}
          value={values.address}
        />
      </InputWrapper>
      <InputWrapper>
        <InputLabel>Amount</InputLabel>
        <TextField
          id="amount"
          name="amount"
          placeholder="Amount"
          value={values.amount}
          helperText={touched.amount && errors.amount}
          error={touched.amount && Boolean(errors.amount)}
          onChange={handleChange}
        />
      </InputWrapper>
      <Button
        onClick={() => dispatch(updatePage(page + 1))}
        fullWidth
        variant="contained"
        disableElevation={true}
        disabled={!(isValid && dirty)}
      >
        Send Funds
      </Button>
      <Button
        color="inherit"
        className={styles["cancelBtn"]}
        onClick={() => dispatch(updatePage(page - 1))}
        variant="text"
      >
        Cancel
      </Button>
    </>
  );
};
export default AddressAmountSelection;
