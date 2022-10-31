import { ICoinStatus } from "../../../redux/slices/minima/coinSlice";
import { Button, Stack } from "@mui/material";
import styles from "./CoinDetails.module.css";

import {
  MiOverlayActionsContainer,
  MiOverlayDetails,
  MiOverlayDetailsContainer,
} from "../../helper/layout/MiOverlay";
import moment from "moment";
import MiCopy from "../../helper/layout/svgs/MiCopy";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectClipboardSelector } from "../../../redux/slices/app/clipboardSlice";
import { showDetails } from "../../../redux/slices/app/futureCoinSlice";
import Decimal from "decimal.js";

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

const CoinDetails = (props: { c: ICoinStatus }) => {
  const dispatch = useAppDispatch();
  const c = props.c;
  console.log(c.state[2].data);
  return (
    <div className={styles["white-overlay"]}>
      <Stack className={styles["overlay-content"]}>
        <MiOverlayDetailsContainer>
          <MiCoinDetailItem
            title="Token"
            value={typeof c.token == "string" ? c.token : c.token.name}
          />
          <MiCoinDetailItem
            title="Amount"
            value={c.tokenid == "0x00" ? c.amount : c.tokenamount}
          />
          <MiCoinDetailItem
            title="Unlock block height"
            value={c.state[0].data}
          />
          <MiCoinDetailItem
            title="Approximate unlock date and time"
            value={
              c.state && c.state[2]
                ? moment(
                    new Decimal(c.state[2].data)
                      // .times(new Decimal(1000))
                      .toNumber()
                  ).format("MMM Do, YYYY H:mm A")
                : "Unavailable"
            }
          />
          <MiCoinDetailItem
            title="Coin assigned to address"
            value={c.state && c.state[1] ? c.state[1].data : "Unavailable"}
            copyable={true}
            copyPayload={
              c.state && c.state[1] ? c.state[1].data : "Unavailable"
            }
          />
          <MiCoinDetailItem
            title="Coin ID"
            value={c.coinid}
            copyable={true}
            copyPayload={c.coinid}
          />
        </MiOverlayDetailsContainer>
        <MiOverlayActionsContainer>
          <Button
            variant="contained"
            disableElevation
            fullWidth
            color="secondary"
            onClick={() => dispatch(showDetails(false))}
          >
            Close
          </Button>
        </MiOverlayActionsContainer>
      </Stack>
    </div>
  );
};

export default CoinDetails;
