import React from "react";
import {
  Button,
  Grid,
  Typography,
  Select,
  MenuItem,
  TextField,
  Stack,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";

import { useFormik } from "formik";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import { selectBalance } from "../../redux/slices/minima/balanceSlice";
import moment from "moment";
import { showToast } from "../../redux/slices/app/toastSlice";
import {
  createBlockTime,
  getFutureCashScriptAddress,
  sendFutureCash,
} from "../../minima/rpc-commands";

const FormFutureCash = () => {
  const walletTokens = useAppSelector(selectBalance);
  const dispatch = useAppDispatch();
  const [filterText, setFilterText] = React.useState("");
  const formik = useFormik({
    initialValues: {
      tokenid: "0x00",
      datetime: moment(new Date().getTime()),
      address: "",
      amount: "",
    },
    onSubmit: async (dt) => {
      // console.log(dt);
      // dispatch(
      //   showToast(`Sent ${dt.amount} cash to the future.`, "success", "")
      // );

      try {
        const blocktime = await createBlockTime(dt.datetime);
        const scriptAddress = await getFutureCashScriptAddress();

        console.log("Calculated blocktime", blocktime);
        console.log("scriptAddress acquired", scriptAddress);
        await sendFutureCash({
          amount: dt.amount,
          scriptAddress: scriptAddress,
          tokenid: dt.tokenid,
          state1: blocktime,
          state2: dt.address,
        });
      } catch (err) {
        dispatch(showToast(`${err}`, "warning", ""));
        formik.setSubmitting(false);
        return;
      }

      dispatch(showToast(`You sent cash to the future!!!!`, "success", ""));

      console.log("Tried blocktime and now here");
    },
  });

  function handleInputChange(event: any) {
    const value = event.target.value;
    setFilterText(value);
    // when the component re-renders the updated filter text will create a new filteredBalance variable
  }
  return (
    <Grid container>
      <Grid item xs={0} sm={4}></Grid>
      <Grid item xs={12} sm={4}>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={2} mb={2}>
            <Typography variant="h6">FutureCash</Typography>
            <Select
              disabled={formik.isSubmitting}
              id="tokenid"
              name="tokenid"
              value={formik.values.tokenid ? formik.values.tokenid : ""}
              onChange={formik.handleChange}
              error={formik.touched.tokenid && Boolean(formik.errors.tokenid)}
              onClose={() => setFilterText("")}
              fullWidth
            >
              {walletTokens.map((w) => (
                <MenuItem value={w.tokenid} key={w.tokenid}>
                  {typeof w.token == "string"
                    ? w.token
                    : typeof w.token.name === "string"
                    ? w.token.name
                    : "No name"}
                </MenuItem>
              ))}
            </Select>
            <TextField
              id="address"
              name="address"
              placeholder="Address"
              onChange={formik.handleChange}
            />
            <TextField
              id="amount"
              name="amount"
              placeholder="Amount"
              onChange={formik.handleChange}
            />
            <DateTimePicker
              disablePast={true}
              value={formik.values.datetime}
              onChange={(value) =>
                formik.setFieldValue("datetime", value, true)
              }
              renderInput={(params: any) => (
                <TextField id="datetime" name="datetime" {...params} />
              )}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation={true}
            >
              Send Funds
            </Button>
          </Stack>
        </form>
        <Stack spacing={2}>
          {/* <Typography variant="h6">FutureCash</Typography> */}
          {/* <TextField /> */}
        </Stack>
      </Grid>
      <Grid item xs={0} sm={4}></Grid>
    </Grid>
  );
};

export default FormFutureCash;
