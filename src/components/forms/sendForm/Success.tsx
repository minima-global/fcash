import React from "react";

import styled from "@emotion/styled";
import MiConfirmationSuccessOtherAddress from "../../helper/layout/svgs/MiConfirmationSuccessOtherAddress";
import MiConfirmationSuccessMyAddress from "../../helper/layout/svgs/MiConfirmationSuccessMyAddress";
import { Stack } from "@mui/system";
import { isAddressMine } from "../../../minima/rpc-commands";

import styles from "../../helper/layout/styling/sendpage/Confirmation.module.css";
import { Button } from "@mui/material";
import { updatePage } from "../../../redux/slices/app/sendFormSlice";
import { MiHeader, MiContent } from "../../helper/layout/MiOverlay";

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
        className={styles["overlay-content"]}
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
            dispatch(updatePage(page - 2));
          }}
          color="secondary"
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
