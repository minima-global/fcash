import React, { useState } from "react";
import {
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
} from "@mui/material";

import { useAppSelector } from "../../../../redux/hooks";
import { selectBalance } from "../../../../redux/slices/minima/balanceSlice";

import styles from "./TokenTimeSelection.module.css";

import { DateTimePicker } from "@mui/x-date-pickers";
import { createBlockTime } from "../../../../minima/rpc-commands";
import MiSelect from "../../../helper/layout/MiSelect";
import {
  InputHelper,
  InputLabel,
  InputWrapper,
  InputWrapperRadio,
} from "../InputWrapper";
import { updatePage } from "../../../../redux/slices/app/sendFormSlice";
import EstimatedBlock from "../EstimatedBlock";
import { getAddress } from "../../../../minima/commands";

const TokenTimeSelection = (props: any) => {
  const walletTokens = useAppSelector(selectBalance);

  const [preferredSelection, setPreffered] = useState<false | "Custom" | "Own">(
    false
  );
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [estimatedBlock, setEstimatedBlock] = React.useState<false | number>(
    false
  );

  const handleAddressSelection = async (e: any) => {
    setFieldValue("address", "");
    try {
      setPreffered(e.target.value);
      const userPrefersOwnAddress = e.target.value === "Own";

      if (userPrefersOwnAddress) {
        setLoadingAddress(true);

        const myAddress = await getAddress();
        setFieldValue("address", myAddress);

        setLoadingAddress(false);
      }
    } catch (error: any) {
      setFieldError("address", error.message);
    }
  };

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
    if (Boolean(errors.datetime)) {
      setEstimatedBlock(false);
    }

    createBlockTime(values.datetime)
      .then((blockHeight) => {
        setEstimatedBlock(blockHeight);
      })
      .catch((err) => {
        setFieldError("datetime", err.message);
      });

    setFieldValue("tokens", values.tokens);
  }, [dispatch, values.tokens, values.datetime, page]);

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
          onChange={(value) => {
            setFieldValue("datetime", value, true);
          }}
          renderInput={(params: any) => {
            return (
              <TextField
                placeholder="Set a date & time"
                InputProps={{
                  readOnly: true,
                }}
                error={Boolean(errors.datetime)}
                helperText={dirty && errors.datetime}
                id="datetime"
                name="datetime"
                onBlur={handleBlur}
                {...params}
              />
            );
          }}
        />
      </InputWrapper>
      <EstimatedBlock>
        {!!estimatedBlock && <p>Estimated block: {estimatedBlock}</p>}
        {!estimatedBlock && <p>N/A</p>}
      </EstimatedBlock>

      <InputWrapperRadio>
        <InputLabel>Enter a wallet address</InputLabel>
        {!preferredSelection && (
          <RadioGroup id="radio-group" onChange={handleAddressSelection}>
            <FormControlLabel
              label="Use my Minima wallet address"
              value="Own"
              control={<Radio />}
            ></FormControlLabel>
            <FormControlLabel
              value="Custom"
              label="Use a different wallet address"
              control={<Radio />}
            ></FormControlLabel>
          </RadioGroup>
        )}
        {preferredSelection && (
          <Stack spacing={1} sx={{ p: 2 }}>
            <InputWrapper>
              <TextField
                id="address"
                name="address"
                disabled={loadingAddress}
                placeholder={
                  loadingAddress ? "Getting you an address..." : "Address"
                }
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={dirty && errors.address}
                error={touched.address && Boolean(errors.address)}
                value={values.address}
              />
            </InputWrapper>
            <Button
              onClick={() => setPreffered(false)}
              variant="outlined"
              color="inherit"
            >
              Back
            </Button>
          </Stack>
        )}
      </InputWrapperRadio>

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
      <InputWrapper>
        <InputLabel>Burn</InputLabel>
        <TextField
          id="burn"
          name="burn"
          placeholder="Burn"
          inputProps={{
            autoComplete: "burn",
          }}
          type="text"
          value={values.burn}
          helperText={dirty && errors.burn}
          error={touched.burn && Boolean(errors.burn)}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <InputHelper>
          Prioritize your transaction by adding a burn. Burn amounts are
          denominated in Minima only.
        </InputHelper>
      </InputWrapper>
      <InputWrapper>
        <InputLabel>Vault Password</InputLabel>
        <TextField
          id="password"
          name="password"
          placeholder="Vault Password"
          inputProps={{
            autoComplete: "new-password",
          }}
          type="password"
          value={values.password}
          helperText={dirty && errors.password}
          error={touched.password && Boolean(errors.password)}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <InputHelper>
          If your database (vault) is locked, use the password here otherwise
          ignore this
        </InputHelper>
      </InputWrapper>
      <Button
        className={styles["btn"]}
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
        Clear
      </Button>
    </>
  );
};

export default TokenTimeSelection;
