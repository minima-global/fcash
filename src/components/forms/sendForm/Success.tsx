import React from "react";

import styled from "@emotion/styled";
import MiConfirmationSuccessOtherAddress from "../../svgs/MiConfirmationSuccessOtherAddress";
import MiConfirmationSuccessMyAddress from "../../svgs/MiConfirmationSuccessMyAddress";
import { Stack } from "@mui/system";
import { isAddressMine } from "../../../minima/rpc-commands";

import styles from "../../styling/sendForm/Confirmation.module.css";
import { Button } from "@mui/material";
import { updatePage } from "../../../redux/slices/app/sendFormSlice";

const MiHeader = styled("h6")`
  font-family: Manrope-regular;
  font-style: normal;
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 33px;
  text-align: center;
  letter-spacing: 0.02em;

  margin-top: 22px;
  margin-bottom: 17px;

  color: #363a3f;
`;

const MiContent = styled("p")`
  font-family: Manrope-regular;
  font-style: normal;
  font-weight: 500;
  font-size: 0.938rem;
  line-height: 24px;
  /* or 160% */

  text-align: center;
  letter-spacing: 0.02em;

  /* Text Colour / Black DM */

  color: #363a3f;

  padding: 0;
  margin: 0;
  margin-bottom: 48px;
`;

const Success = (props: any) => {
  const { values, page, setPage, resetForm, dispatch } = props;
  const [relevantAddress, setRelevantAddress] = React.useState(false);

  React.useEffect(() => {
    isAddressMine(values.address)
      .then(() => {
        setRelevantAddress(true);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  return (
    <div className={styles["white-overlay"]}>
      <Stack
        className={styles["content"]}
        alignItems="center"
        justifyContent="center"
      >
        {relevantAddress ? (
          <MiConfirmationSuccessMyAddress width={290} height={190} />
        ) : (
          <MiConfirmationSuccessOtherAddress width={183} height={195} />
        )}
        <MiHeader>
          Funds <br /> successfully sent
        </MiHeader>
        {relevantAddress ? (
          <MiContent>
            You can find your contract in the Future screen, where it will
            remain in pending status until it is ready to be collected.
          </MiContent>
        ) : (
          <MiContent>
            Please now inform your recipient that they can find the contract in
            the Future screen in their FutureCash MiniDapp.
          </MiContent>
        )}

        <Button
          onClick={() => {
            resetForm();
            dispatch(updatePage(page - 3));
          }}
          fullWidth
          variant="contained"
        >
          Close
        </Button>
      </Stack>
    </div>
  );
};

export default Success;
