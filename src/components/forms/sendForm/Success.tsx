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
import MiColoredOverlay from "../../helper/layout/MiColoredOverlay";

const Success = (props: any) => {
  const { values, page, resetForm, dispatch } = props;
  const [relevantAddress, setRelevantAddress] = React.useState(false);

  React.useEffect(() => {
    isAddressMine(values.address)
      .then(() => {
        setRelevantAddress(true);
      })
      .catch((err) => {
        // console.error(err);
      });
  });

  return (
    <MiColoredOverlay color="white">
      <Stack spacing={5}>
        <Stack alignItems="center">
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
              Please now inform your recipient that they can find the contract
              in the Future screen in their FutureCash MiniDapp.
            </MiContent>
          )}
        </Stack>
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
    </MiColoredOverlay>
  );
};

export default Success;
