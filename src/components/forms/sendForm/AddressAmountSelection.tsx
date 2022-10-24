import { Button, TextField } from "@mui/material";
import { InputWrapper, InputLabel } from "./InputWrapper";
import styles from "../../styling/sendForm/TokenSelect.module.css";
import { updatePage } from "../../../redux/slices/app/sendFormSlice";

const AddressAmountSelection = (props: any) => {
  const {
    values,
    touched,
    errors,
    page,
    handleChange,
    handleBlur,
    isValid,
    dirty,
    dispatch,
  } = props;

  return (
    <>
      <InputWrapper>
        <InputLabel>Enter a wallet address</InputLabel>
        <TextField
          id="address"
          name="address"
          placeholder="Address"
          onChange={handleChange}
          onBlur={handleBlur}
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
          onBlur={handleBlur}
        />
      </InputWrapper>
      <Button
        onClick={() => dispatch(updatePage(page + 1))}
        fullWidth
        variant="contained"
        disableElevation={true}
        disabled={!isValid}
      >
        Send Funds
      </Button>
      <Button
        color="inherit"
        className={styles["cancelBtn"]}
        onClick={() => {
          dispatch(updatePage(page - 1));
        }}
        variant="text"
      >
        Cancel
      </Button>
    </>
  );
};
export default AddressAmountSelection;
