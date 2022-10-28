import { Stack, Button } from "@mui/material";
import React from "react";
import { createBlockTime } from "../../../minima/rpc-commands";
import { updatePage } from "../../../redux/slices/app/sendFormSlice";
import { MiOverlayActionsContainer } from "../../helper/layout/MiOverlay";

import styles from "../../helper/layout/styling/sendpage/Confirmation.module.css";
import ConfirmationDetailList from "./ConfirmationDetailList";

const Confirmation = (props: any) => {
  const { values, page, isSubmitting, dispatch } = props;

  console.log("currentPage", page);

  const token = props.values.token;
  const [estimatedBlockTime, setEstimatedBlockTime] = React.useState(0);

  React.useEffect(() => {
    createBlockTime(values.datetime)
      .then((blktime) => {
        setEstimatedBlockTime(blktime);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const details = {
    tokenName:
      token !== undefined && token.token && typeof token.token === "string"
        ? token.token
        : token?.token.name,
    amount: values.amount,
    datetime: values.datetime,
    estimatedBlock: estimatedBlockTime,
    tokenId:
      token !== undefined && token.tokenid ? token.tokenid : "Unavailable",
    address: values.address,
  };

  return (
    <>
      <div className={styles["white-overlay"]}>
        <Stack className={styles["overlay-content"]}>
          <ConfirmationDetailList
            tokenName={details.tokenName}
            amount={details.amount}
            datetime={details.datetime}
            estimatedBlock={details.estimatedBlock}
            tokenId={details.tokenId}
            address={details.address}
          />
          <MiOverlayActionsContainer>
            <Button
              variant="contained"
              color="secondary"
              disableElevation
              type="submit"
              disabled={isSubmitting}
            >
              Confirm
            </Button>
            <Button
              disabled={isSubmitting}
              color="inherit"
              className={styles["cancelBtn"]}
              onClick={() => dispatch(updatePage(page - 1))}
            >
              Cancel
            </Button>
          </MiOverlayActionsContainer>
        </Stack>
      </div>
    </>
  );
};

export default Confirmation;
