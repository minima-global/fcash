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
    setFieldValue,
    setFieldError,
    page,
    dispatch,
    resetForm,
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

  return (
    <>
      <MiSelect
        id="tokenid"
        name="tokenid"
        value={values.tokenid}
        onChange={handleChange}
        fullWidth={true}
        error={touched.tokenid && Boolean(errors.tokenid) ? true : false}
        tokens={walletTokens}
        setFormTokenId={setFieldValue}
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
      <Button
        disabled={Boolean(errors.datetime) || Boolean(errors.tokenid)}
        variant="contained"
        disableElevation
        onClick={() => dispatch(updatePage(page + 1))}
      >
        Continue
      </Button>
      <Button
        disabled={Boolean(errors.datetime) || Boolean(errors.tokenid)}
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
