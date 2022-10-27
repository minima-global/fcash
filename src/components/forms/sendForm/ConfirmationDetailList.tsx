import { Stack } from "@mui/material";
import { FC } from "react";

import MiCopy from "../../svgs/MiCopy";
import styles from "../../styling/sendForm/Confirmation.module.css";
import theme from "../../../theme";
import { selectClipboardSelector } from "../../../redux/slices/app/clipboardSlice";
import { useAppSelector } from "../../../redux/hooks";

export interface IConfirmationList {
  tokenName: string;
  amount: string;
  datetime: moment.Moment;
  estimatedBlock: number;
  tokenId: string;
  address: string;
}
const ConfirmationDetailList: FC<IConfirmationList> = ({
  tokenName,
  amount,
  datetime,
  estimatedBlock,
  tokenId,
  address,
}) => {
  const clipboardStatusSelector = useAppSelector<any>(selectClipboardSelector);
  // console.log("clipboardStatusSelector", clipboardStatusSelector);
  return (
    <Stack className={styles["confirmationDetailList"]}>
      <div>
        <h5>Token:</h5>
        <p>{tokenName}</p>
      </div>
      <div>
        <h5>Amount:</h5>
        <p>{amount}</p>
      </div>
      <div>
        <h5>Address:</h5>
        <p>{address}</p>
      </div>
      <div>
        <h5>Unlock date & time:</h5>
        <p>{datetime.format("ddd MMM D YYYY, hh:m:s A")}</p>
      </div>
      <div>
        <h5>Unlock blocktime:</h5>
        <p>{estimatedBlock}</p>
      </div>
      <div>
        <div className={styles["copyContainer"]}>
          <h5>Token ID:</h5>
          <MiCopy
            size={28}
            color={!clipboardStatusSelector.status ? "#317aff" : "#4E8B7C"}
            copyPayload={tokenId}
          />
        </div>
        <p>{tokenId}</p>
      </div>
    </Stack>
  );
};

export default ConfirmationDetailList;
