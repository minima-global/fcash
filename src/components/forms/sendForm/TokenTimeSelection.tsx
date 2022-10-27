import React from "react";
import { TextField, Button } from "@mui/material";

import { useAppSelector } from "../../../redux/hooks";
import { selectBalance } from "../../../redux/slices/minima/balanceSlice";

import styles from "../../styling/sendForm/TokenSelect.module.css";

import { DateTimePicker } from "@mui/x-date-pickers";
import { createBlockTime } from "../../../minima/rpc-commands";
import MiSelect from "../../helper/layout/MiSelect";
import { InputLabel, InputWrapper } from "./InputWrapper";
import { updatePage } from "../../../redux/slices/app/sendFormSlice";

const TokenTimeSelection = (props: any) => {
  const walletTokens = useAppSelector(selectBalance);
  const [estimatedBlock, setEstimatedBlock] = React.useState(0);

  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    page,
    dispatch,
    resetForm,
    isValid,
    dirty,
  } = props;

  React.useEffect(() => {
    createBlockTime(values.datetime)
      .then((blockHeight) => {
        setEstimatedBlock(blockHeight);
      })
      .catch((err) => {
        dispatch(`${err}`, "warning", "");
        console.error(err);
      });
  }, [dispatch]);

  console.log("dirty textfields", dirty);
  return (
    <>
      <MiSelect
        id="token"
        name="token"
        value={values.token}
        onChange={handleChange}
        fullWidth={true}
        error={touched.token && Boolean(errors.token) ? true : false}
        tokens={walletTokens}
        setFieldValue={setFieldValue}
        resetForm={resetForm}
      />
      <InputWrapper>
        <InputLabel>Date & time</InputLabel>
        <DateTimePicker
          disablePast={true}
          value={values.datetime}
          onChange={(value) => setFieldValue("datetime", value, true)}
          onClose={() => {
            createBlockTime(values.datetime)
              .then((blktime) => {
                setEstimatedBlock(blktime);
                console.log("Success");
              })
              .catch((err) => {
                setFieldError("datetime", err);
              });
          }}
          renderInput={(params: any) => (
            <TextField
              error={touched.datetime && Boolean(errors.datetime)}
              helperText={touched.datetime && errors.datetime}
              id="datetime"
              name="datetime"
              onBlur={handleBlur}
              {...params}
            />
          )}
        />
      </InputWrapper>
      <InputWrapper>
        <InputLabel>Estimated block height</InputLabel>
        <TextField
          id="estimatedBlock"
          name="estimatedBlock"
          value={estimatedBlock}
          InputProps={{
            readOnly: true,
          }}
        />
      </InputWrapper>
      <InputWrapper>
        <InputLabel>Enter a wallet address</InputLabel>
        <TextField
          id="address"
          name="address"
          placeholder="Address"
          onChange={handleChange}
          onBlur={handleBlur}
          helperText={dirty && errors.address}
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
          helperText={dirty && errors.amount}
          error={touched.amount && Boolean(errors.amount)}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </InputWrapper>
      <Button
        sx={{ marginTop: "24px!important" }}
        disabled={!(isValid && dirty)}
        color="secondary"
        variant="contained"
        disableElevation
        onClick={() => dispatch(updatePage(page + 1))}
      >
        Send Funds
      </Button>
      <Button
        disabled={Boolean(errors.datetime) || Boolean(errors.token)}
        color="inherit"
        className={styles["cancelBtn"]}
        onClick={() => resetForm()}
      >
        Cancel
      </Button>
    </>
  );
};

export default TokenTimeSelection;
