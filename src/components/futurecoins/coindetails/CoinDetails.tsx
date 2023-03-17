import { Button, Stack } from "@mui/material";
import styles from "./CoinDetails.module.css";

import {
  MiOverlayDetails,
  MiOverlayDetailsContainer,
} from "../../helper/layout/MiOverlay";
import { format } from "date-fns";
import MiCopy from "../../helper/layout/svgs/MiCopy";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectClipboardSelector } from "../../../redux/slices/app/clipboardSlice";
import Decimal from "decimal.js";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MiColoredOverlay from "../../helper/layout/MiColoredOverlay";
import { selectChainHeight } from "../../../redux/slices/minima/statusSlice";

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
  const navigate = useNavigate();
  const chainHeight = useAppSelector(selectChainHeight);
  const location = useLocation();
  const { state: coin } = location;

  return (
    <MiColoredOverlay color="white">
      {coin && (
        <>
          <MiOverlayDetailsContainer>
            <Stack spacing={5}>
              <Stack>
                {coin.tokenid === "0x00" && (
                  <MiCoinDetailItem title="Token" value={coin.token} />
                )}
                {coin.tokenid !== "0x00" && (
                  <MiCoinDetailItem
                    title="Token"
                    value={coin.token.name ? coin.token.name : "N/A"}
                  />
                )}
                {coin.tokenid === "0x00" && (
                  <MiCoinDetailItem title="Amount" value={coin.amount} />
                )}
                {coin.tokenid !== "0x00" && (
                  <MiCoinDetailItem title="Amount" value={coin.tokenamount} />
                )}

                <MiCoinDetailItem
                  title="Current block height"
                  value={chainHeight}
                />

                {coin.state.length && (
                  <MiCoinDetailItem
                    title="Remaining blocks until unlock"
                    value={
                      MDS.util.getStateVariable(coin, 1)
                        ? new Decimal(MDS.util.getStateVariable(coin, 1))
                            .minus(chainHeight)
                            .toNumber()
                        : "N/A"
                    }
                  />
                )}

                {coin.state.length && (
                  <MiCoinDetailItem
                    title="Current coin age"
                    value={
                      MDS.util.getStateVariable(coin, 1) &&
                      MDS.util.getStateVariable(coin, 4)
                        ? new Decimal(MDS.util.getStateVariable(coin, 4))
                            .minus(
                              new Decimal(
                                MDS.util.getStateVariable(coin, 1)
                              ).minus(chainHeight)
                            )
                            .toNumber()
                        : "N/A"
                    }
                  />
                )}
                {coin.state.length && (
                  <MiCoinDetailItem
                    title="Age of coin on unlock"
                    value={
                      MDS.util.getStateVariable(coin, 4)
                        ? MDS.util.getStateVariable(coin, 4)
                        : "N/A"
                    }
                  />
                )}

                {coin.state.length && (
                  <MiCoinDetailItem
                    title="Unlock block height"
                    value={
                      MDS.util.getStateVariable(coin, 1)
                        ? MDS.util.getStateVariable(coin, 1)
                        : "N/A"
                    }
                  />
                )}

                {coin.state.length && (
                  <MiCoinDetailItem
                    title="Approximate unlock date and time"
                    value={
                      MDS.util.getStateVariable(coin, 3)
                        ? format(
                            new Decimal(
                              MDS.util.getStateVariable(coin, 3)
                            ).toNumber(),
                            "MMM do, yyyy hh:mm:ss aa"
                          )
                        : "N/A"
                    }
                  />
                )}
                {coin.state.length && (
                  <MiCoinDetailItem
                    title="Coin assigned to address"
                    value={
                      MDS.util.getStateVariable(coin, 2)
                        ? MDS.util.getStateVariable(coin, 2)
                        : "N/A"
                    }
                    copyable={true}
                    copyPayload={
                      MDS.util.getStateVariable(coin, 2)
                        ? MDS.util.getStateVariable(coin, 2)
                        : "N/A"
                    }
                  />
                )}
                <MiCoinDetailItem
                  title="Coin ID"
                  value={coin.coinid}
                  copyable={true}
                  copyPayload={coin.coinid}
                />
              </Stack>
              <Button
                variant="contained"
                disableElevation
                fullWidth
                color="secondary"
                onClick={() => navigate(-1)}
              >
                Close
              </Button>
            </Stack>
          </MiOverlayDetailsContainer>
        </>
      )}

      {!coin && <div>Coin not found.</div>}
    </MiColoredOverlay>
  );
};

export default CoinDetails;
