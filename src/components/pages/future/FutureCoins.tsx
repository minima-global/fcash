import React from "react";
import { Stack } from "@mui/system";
import styled from "@emotion/styled";
import { Avatar, Button } from "@mui/material";
import {
  MiCoinName,
  MiCoinAmount,
  MiUnlockDate,
  MiFutureCoin,
} from "../../helper/layout/MiCoin";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  flagCoinCollection,
  selectFutureCash,
  updatePendingStatus,
} from "../../../redux/slices/minima/coinSlice";
import { selectChainHeight } from "../../../redux/slices/minima/statusSlice";
import { selectBalance } from "../../../redux/slices/minima/balanceSlice";

import styles from "./FutureCoins.module.css";

import moment from "moment";
import { mergeArray } from "../../../utils";
import Decimal from "decimal.js";
import { Outlet, useNavigate } from "react-router-dom";
import { Coin, MinimaToken } from "../../../minima/@types/minima";
import { collectFutureCash } from "../../../minima/rpc-commands";
import {
  selectPageSelector,
  updatePage,
} from "../../../redux/slices/app/futureCoinSlice";
import MiSuccess from "../../futurecoins/Success";
import { TabButton, Tabs } from "../../helper/layout/MiTabs";

import MinimaLogoSquare from "../../../assets/images/minimaLogoSquare.png";
import { MINIMA__TOKEN_ID } from "../../../minima/constants";

const MiFutureContainer = styled("div")`
  background: #ffffff;
  box-shadow: 0px 4px 10px 4px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 16px 18px;

  > :last-of-type {
    margin-bottom: 0;
  }
`;

const MiNoResults = styled("div")`
  border-radius: 12px;
  position: relative !important;
  background: #fff;
  z-index: 0;
  > svg {
    border-radius: 12px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
`;

const MiNothingToSee = styled("h6")`
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 33px;
  text-align: center;
  letter-spacing: 0.02em;
  color: #363a3f;
  z-index: 1;
  padding: 0;
  margin: 0;
  padding-top: 42px;
  padding-bottom: 15px;
`;

const MiNothingToSeeSubtitle = styled("p")`
  position: relative;
  z-index: 1;

  font-weight: 500;
  font-size: 0.938rem;
  line-height: 24px;

  text-align: center;
  letter-spacing: 0.02em;

  color: #363a3f;
  padding: 0;
  margin: 0;
  padding-bottom: 33px;
`;

const MiUnlockButton = styled("button")`
  background: #16181c;
  text-overflow: ellipsis;
  overflow: hidden;
  border-radius: 6px;
  border: none;
  color: #ffffff;
  min-height: 32px;
  max-height: 32px;
  margin: auto 0;
  width: 85px;
  letter-spacing: 0.01em;
  font-weight: 800;
  :disabled {
    background: #d3d3d8;
    color: #fff;
  }
`;

const FutureCoins = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [pendingCoins, setPendingCoins] = React.useState([]);
  const [readyCoins, setReadyCoins] = React.useState([]);
  const coins = useAppSelector(selectFutureCash);
  const walletTokens = useAppSelector(selectBalance);
  const chainHeight = useAppSelector(selectChainHeight);
  const futurePageSelector = useAppSelector(selectPageSelector);
  // merge the coins with walletTokens to get the token names & details
  const merged = mergeArray(coins, walletTokens);

  const [tabOpen, setTabOpenIndex] = React.useState(0);
  const toggle = (i: number) => setTabOpenIndex(i);

  const filterForPending = (c: Coin & MinimaToken) => {
    const endOfContractBlockHeight = MDS.util.getStateVariable(c, 1);

    return new Decimal(chainHeight).lessThan(
      new Decimal(endOfContractBlockHeight)
    );
  };

  const filterForReady = (c: Coin & MinimaToken) => {
    const endOfContractBlockHeight = MDS.util.getStateVariable(c, 1);
    return new Decimal(chainHeight).greaterThanOrEqualTo(
      new Decimal(endOfContractBlockHeight)
    );
  };

  React.useEffect(() => {
    setPendingCoins(merged.filter(filterForPending));
    setReadyCoins(merged.filter(filterForReady));
  }, [coins, chainHeight]);

  return (
    <>
      <Outlet />
      {/* Success Page on collection */}
      {futurePageSelector.page == 1 && <MiSuccess />}

      {/* Tabs */}
      {futurePageSelector.page == 0 && (
        <Stack spacing={3}>
          <Tabs>
            <TabButton
              onClick={() => toggle(0)}
              className={tabOpen == 0 ? styles["tab-open"] : undefined}
            >
              Pending{" "}
              {pendingCoins.length > 0 ? `(${pendingCoins.length})` : ""}
            </TabButton>
            <TabButton
              onClick={() => toggle(1)}
              className={tabOpen == 1 ? styles["tab-open"] : undefined}
            >
              Ready {readyCoins.length > 0 ? `(${readyCoins.length})` : ""}
            </TabButton>
          </Tabs>

          {!!pendingCoins.length && tabOpen === 0 && (
            <ul className={styles["futures"]}>
              {pendingCoins.map((c: any) => (
                <li
                  id="pending-coin"
                  key={c.coinid}
                  onClick={() => {
                    navigate("coindetails", { state: { ...c } });
                  }}
                >
                  <img
                    alt="token-img"
                    src={
                      c.tokenid === MINIMA__TOKEN_ID
                        ? MinimaLogoSquare
                        : c.token.url && c.token.url.length
                        ? c.token.url
                        : `https://robohash.org/${c.tokenid}`
                    }
                  />
                  <div>
                    <h6>
                      {typeof c.token == "string" ? c.token : c.token.name}
                    </h6>
                    <p>{c.tokenid == "0x00" ? c.amount : c.tokenamount}</p>
                  </div>
                  {!!c.state.length && (
                    <div>
                      {moment(
                        new Decimal(MDS.util.getStateVariable(c, 3)).toNumber()
                      ).format("MMM Do, YY")}{" "}
                      <br />
                      {moment(
                        new Decimal(MDS.util.getStateVariable(c, 3)).toNumber()
                      ).format("hh:mm A")}
                    </div>
                  )}
                  {!c.state.length && <div>Date/Time N/A</div>}
                </li>
              ))}
            </ul>
          )}

          {!!readyCoins.length && tabOpen === 1 && (
            <ul className={styles["futures"]}>
              {readyCoins.map((c: any) => (
                <li id="ready-coin" key={c.coinid}>
                  <img
                    alt="token-img"
                    src={
                      c.tokenid === MINIMA__TOKEN_ID
                        ? MinimaLogoSquare
                        : c.token.url && c.token.url.length
                        ? c.token.url
                        : `https://robohash.org/${c.tokenid}`
                    }
                  />
                  <div>
                    <h6>
                      {typeof c.token == "string" ? c.token : c.token.name}
                    </h6>
                    <p>{c.tokenid == "0x00" ? c.amount : c.tokenamount}</p>
                  </div>
                  <MiUnlockButton
                    disabled={c.status && c.status == "PENDING"}
                    onClick={async () => {
                      // dispatch a flag on the coin being collected.
                      dispatch(flagCoinCollection(c.coinid)); // flag this coin as being collected
                      dispatch(updatePendingStatus(true)); // there are pending collection coins in our balance

                      try {
                        await collectFutureCash({
                          coinid: c.coinid,
                          address: MDS.util.getStateVariable(c, 2),
                          tokenid: c.tokenid,
                          amount:
                            c.tokenid == "0x00" ? c.amount : c.tokenamount,
                        });
                        // show success page
                        dispatch(updatePage(futurePageSelector.page + 1));
                      } catch (err: any) {
                        console.error(err);
                      }
                    }}
                  >
                    {c.status == "PENDING" ? "Collecting..." : "Collect"}
                  </MiUnlockButton>
                </li>
              ))}
            </ul>
          )}

          {(!pendingCoins.length && tabOpen === 0) ||
            (!readyCoins.length && tabOpen === 1 && (
              <MiNoResults>
                {/* <MiFutureNoResults /> */}
                <Stack spacing={2} sx={{ m: 2 }}>
                  <MiNothingToSee>
                    Nothing to <br /> see here!
                  </MiNothingToSee>
                  <MiNothingToSeeSubtitle>
                    You currently have no <br />{" "}
                    {tabOpen === 1
                      ? "have no contracts that are ready to collect."
                      : "pending contracts."}
                  </MiNothingToSeeSubtitle>
                  <Button
                    color="secondary"
                    variant="contained"
                    disableElevation
                    fullWidth
                    onClick={() => navigate("/send")}
                  >
                    Start contract
                  </Button>
                </Stack>
              </MiNoResults>
            ))}
        </Stack>
      )}
    </>
  );
};

export default FutureCoins;
