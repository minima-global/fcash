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
import Decimal from "decimal.js";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MiColoredOverlay from "../../helper/layout/MiColoredOverlay";

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

const CoinDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [coinDetail, setCoinDetail] = React.useState<ICoinStatus | undefined>(
    undefined
  );
  const location = useLocation();

  React.useEffect(() => {
    setCoinDetail(location.state);
  }, [dispatch, location]);

  return (
    <MiColoredOverlay color="white">
      {typeof coinDetail !== "undefined" ? (
        <>
          <MiOverlayDetailsContainer>
            <MiCoinDetailItem
              title="Token"
              value={
                typeof coinDetail.token == "string"
                  ? coinDetail.token
                  : coinDetail.token.name
              }
            />
            <MiCoinDetailItem
              title="Amount"
              value={
                coinDetail.tokenid == "0x00"
                  ? coinDetail.amount
                  : coinDetail.tokenamount
              }
            />
            <MiCoinDetailItem
              title="Unlock block height"
              value={coinDetail.state[0].data}
            />
            <MiCoinDetailItem
              title="Approximate unlock date and time"
              value={
                coinDetail.state && coinDetail.state[2]
                  ? moment(
                      new Decimal(coinDetail.state[2].data)
                        // .times(new Decimal(1000))
                        .toNumber()
                    ).format("MMM Do, YYYY H:mm A")
                  : "Unavailable"
              }
            />
            <MiCoinDetailItem
              title="Coin assigned to address"
              value={
                coinDetail.state && coinDetail.state[1]
                  ? coinDetail.state[1].data
                  : "Unavailable"
              }
              copyable={true}
              copyPayload={
                coinDetail.state && coinDetail.state[1]
                  ? coinDetail.state[1].data
                  : "Unavailable"
              }
            />
            <MiCoinDetailItem
              title="Coin ID"
              value={coinDetail.coinid}
              copyable={true}
              copyPayload={coinDetail.coinid}
            />
          </MiOverlayDetailsContainer>
          <MiOverlayActionsContainer>
            <Button
              variant="contained"
              disableElevation
              fullWidth
              color="secondary"
              onClick={() => navigate(-1)}
            >
              Close
            </Button>
          </MiOverlayActionsContainer>
        </>
      ) : null}
    </MiColoredOverlay>
  );
};

export default CoinDetails;
