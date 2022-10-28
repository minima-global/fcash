import { ICoinStatus } from "../../redux/slices/minima/coinSlice";
import { Stack } from "@mui/material";
import styles from "../styling/futurepage/index.module.css";

import { MiOverlayDetails } from "../helper/layout/MiOverlay";
import moment from "moment";
import MiCopy from "../helper/layout/svgs/MiCopy";
import { useAppSelector } from "../../redux/hooks";
import { selectClipboardSelector } from "../../redux/slices/app/clipboardSlice";

interface ICoinDetail {
  title: string;
  value: any;
  copyable?: boolean;
  copyPayload?: any;
}
const MiCoinDetailItem = ({
  title,
  value,
  copyable,
  copyPayload,
}: ICoinDetail) => {
  const clipboardStatusSelector = useAppSelector(selectClipboardSelector);
  return (
    <MiOverlayDetails>
      <h5>{title + ":"}</h5>
      <p>{value}</p>
      {copyable && (
        <MiCopy
          size={28}
          color={!clipboardStatusSelector.status ? "#317aff" : "#4E8B7C"}
          copyPayload={copyPayload}
        />
      )}
    </MiOverlayDetails>
  );
};

const CoinDetails = (props: { c: ICoinStatus }) => {
  const c = props.c;
  console.log(props);
  return (
    <div className={styles["white-overlay"]}>
      <Stack
        className={styles["content"]}
        alignItems="center"
        justifyContent="center"
      >
        <MiCoinDetailItem
          title="Token"
          value={typeof c.token == "string" ? c.token : c.token.name}
        />
        <MiCoinDetailItem
          title="Amount"
          value={c.tokenid == "0x00" ? c.amount : c.tokenamount}
        />
        <MiCoinDetailItem title="Unlock block height" value={c.state[0].data} />
        <MiCoinDetailItem
          title="Approximate unlock date and time"
          value={moment(c.state[2].data).format("MMM Do, YY H:mm A")}
        />
        <MiCoinDetailItem
          title="Coin assigned to address"
          value={c.state[1].data}
          copyable={true}
          copyPayload={c.state[1].data}
        />
        <MiCoinDetailItem
          title="Coin assigned to address"
          value={c.coinid}
          copyable={true}
          copyPayload={c.coinid}
        />
      </Stack>
    </div>
  );
};

export default CoinDetails;
