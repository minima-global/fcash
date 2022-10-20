import { Stack, List, Button } from "@mui/material";
import React from "react";
import { createBlockTime } from "../../../minima/rpc-commands";
import { useAppSelector } from "../../../redux/hooks";
import { updatePage } from "../../../redux/slices/app/sendFormSlice";
import { selectBalance } from "../../../redux/slices/minima/balanceSlice";

import styles from "../../styling/sendForm/Confirmation.module.css";
import MiDismiss from "../../svgs/MiDismiss";
import ConfirmationDetailList from "./ConfirmationDetailList";

const Confirmation = (props: any) => {
  const { values, page, isSubmitting, dispatch } = props;

  const wallet = useAppSelector(selectBalance);

  const token = wallet.find((w) => w.tokenid === values.tokenid);
  const [estimatedBlockTime, setEstimatedBlockTime] = React.useState(0);
  //console.log("Found token", token);
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
        <Stack className={styles["content"]}>
          <Stack direction="row" justifyContent="flex-end">
            <MiDismiss onClick={() => dispatch(updatePage(page - 1))} />
          </Stack>
          <ConfirmationDetailList
            tokenName={details.tokenName}
            amount={details.amount}
            datetime={details.datetime}
            estimatedBlock={details.estimatedBlock}
            tokenId={details.tokenId}
            address={details.address}
          />
          <Button
            variant="contained"
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
        </Stack>
      </div>
    </>
  );
};

export default Confirmation;
