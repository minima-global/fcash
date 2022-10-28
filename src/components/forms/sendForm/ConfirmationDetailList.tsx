import { Stack } from "@mui/material";
import { FC } from "react";

import MiCopy from "../../helper/layout/svgs/MiCopy";
import styles from "../../helper/layout/styling/sendpage/Confirmation.module.css";
import { selectClipboardSelector } from "../../../redux/slices/app/clipboardSlice";
import { useAppSelector } from "../../../redux/hooks";
import {
  MiOverlayDetails,
  MiOverlayDetailsContainer,
} from "../../helper/layout/MiOverlay";

export interface IConfirmationList {
  tokenName: string;
  amount: string;
  datetime: moment.Moment;
  estimatedBlock: number;
  tokenId: string;
  address: string;
}
interface IConfirmationDetail {
  title: string;
  value: any;
  copyable?: boolean;
  copyPayload?: any;
}
const MiTokenDetailItem = ({
  title,
  value,
  copyable,
  copyPayload,
}: IConfirmationDetail) => {
  const clipboardStatusSelector = useAppSelector(selectClipboardSelector);
  return (
    <MiOverlayDetails>
      {copyable && (
        <>
          <div className={styles["copyContainer"]}>
            <h5>{title + ":"}</h5>
            <MiCopy
              size={28}
              color={!clipboardStatusSelector.status ? "#317aff" : "#4E8B7C"}
              copyPayload={copyPayload}
            />
          </div>
          <p className={styles["pt-8"]}>{value}</p>
        </>
      )}
      {!copyable && (
        <>
          <h5>{title + ":"}</h5>
          <p>{value}</p>
        </>
      )}
    </MiOverlayDetails>
  );
};
const ConfirmationDetailList: FC<IConfirmationList> = ({
  tokenName,
  amount,
  datetime,
  estimatedBlock,
  tokenId,
  address,
}) => {
  return (
    <MiOverlayDetailsContainer>
      <MiTokenDetailItem title="Token" value={tokenName}></MiTokenDetailItem>
      <MiTokenDetailItem title="Address" value={address}></MiTokenDetailItem>
      <MiTokenDetailItem
        title="Unlock date & time"
        value={datetime.format("ddd MMM D YYYY, hh:m:s A")}
      ></MiTokenDetailItem>
      <MiTokenDetailItem
        title="Unlock blocktime"
        value={estimatedBlock}
      ></MiTokenDetailItem>
      <MiTokenDetailItem
        title="Token ID"
        value={tokenId}
        copyable={true}
        copyPayload={tokenId}
      ></MiTokenDetailItem>
    </MiOverlayDetailsContainer>
  );
};

export default ConfirmationDetailList;
