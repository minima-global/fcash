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
    isValid,
    dirty,
    dispatch,
  } = props;

  // React.useEffect(() => {
  // const tkn = walletTokens.find(
  //   (t: MinimaToken) => t.tokenid == values.tokenid
  // );

  // if (tkn == undefined) return;

  // if (values.amount.length == 0) return;

  // try {
  //   const hasFunds = new Decimal(values.amount).lessThan(
  //     new Decimal(tkn.sendable)
  //   );

  //   if (!hasFunds) {
  //     console.log(`setting field error`);

  //     setFieldError("amount", "Insufficient funds!");
  //   }
  // } catch (err) {
  //   console.error(err);
  // }
  // }, [values.amount]);

  console.log(errors);

  return (
    <>
      <InputWrapper>
        <InputLabel>Enter a wallet address</InputLabel>
        <TextField
          id="address"
          name="address"
          placeholder="Address"
          onChange={handleChange}
          helperText={errors.address}
          error={Boolean(errors.address)}
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
          helperText={errors.amount}
          error={Boolean(errors.amount)}
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
