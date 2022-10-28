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
  ICoinStatus,
  selectFutureCash,
  updatePendingStatus,
} from "../../../redux/slices/minima/coinSlice";
import { selectChainHeight } from "../../../redux/slices/minima/statusSlice";
import { selectBalance } from "../../../redux/slices/minima/balanceSlice";

import styles from "./FutureCoins.module.css";

import moment from "moment";
import { mergeArray } from "../../../utils";
import Decimal from "decimal.js";
import MiFutureNoResults from "../../helper/layout/svgs/MiFutureNoResults";
import { useNavigate } from "react-router-dom";
import { Coin, MinimaToken } from "../../../minima/types/minima";
import { collectFutureCash } from "../../../minima/rpc-commands";
import {
  ICoinDetails,
  selectPageSelector,
  setDetails,
  updatePage,
} from "../../../redux/slices/app/futureCoinSlice";
import MiSuccess from "../../futurecoins/Success";

const Tabs = styled("div")`
  height: 48px;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  justify-content: space-evenly;
  padding: 5px;
  > :first-of-type {
    margin-right: 4.5px;
  }
`;

const TabButton = styled("button")`
  background: #fff;
  width: 100%;
  border-radius: 8px;
  letter-spacing: 0.01em;
  color: #16181c;
  font-family: Manrope-regular;
  font-weight: 800;
  font-size: 0.938rem;
  border: none;
`;

const MiFutureContainer = styled("div")`
  background: #ffffff;
  box-shadow: 0px 4px 10px 4px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 16px 18px;
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
  }
`;

const MiNothingToSee = styled("h6")`
  font-family: Manrope-regular;
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
  font-family: Manrope-regular;

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
  border-radius: 6px;
  border: none;
  color: #fff;
  height: 32px;
  width: 85px;
  letter-spacing: 0.01em;
  font-family: Manrope-regular;
  font-weight: 800;
  :disabled {
    background: #d3d3d8;
    color: #fff;
  }
`;

const FutureCoins = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const coins = useAppSelector(selectFutureCash);
  const walletTokens = useAppSelector(selectBalance);
  const chainHeight = useAppSelector(selectChainHeight);
  const futurePageSelector = useAppSelector(selectPageSelector);
  const merged = mergeArray(coins, walletTokens);

  const viewAndSetDetailsPage = (c: ICoinStatus) => {
    const payload: ICoinDetails = {
      name:
        typeof c.token == "string"
          ? c.token
          : typeof c.token && c.token.hasOwnProperty("name")
          ? c.token.name
          : "Undefined",
      amount:
        c.tokenid == "0x00"
          ? c.amount
          : c.tokenamount
          ? c.tokenamount
          : "Undefined",
      unlockdatetime:
        c.state && c.state[2]
          ? moment(c.state[2].data).format("MMM Do, YY H:mm A")
          : "Undefined",
      unlockblock: c.state && c.state[0] ? c.state[0].data : "Unavailable",
      address: c.state && c.state[1] ? c.state[1].data : "Unavailable",
      coinid: c.coinid,
    };

    dispatch(setDetails(payload));
  };

  const [tabOpen, setTabOpenIndex] = React.useState(0);
  const toggle = (i: number) => setTabOpenIndex(i);
  const filterForPending = (c: Coin & MinimaToken) => {
    if (new Decimal(chainHeight).greaterThan(new Decimal(c.state[0].data))) {
      return true;
    }
  };
  const filterForReady = (c: Coin & MinimaToken) => {
    if (new Decimal(chainHeight).lessThan(new Decimal(c.state[0].data))) {
      return true;
    }
  };

  return (
    <>
      {/* {futurePageSelector.details == true && <CoinDetails />} */}

      {futurePageSelector.page == 1 && <MiSuccess />}

      {futurePageSelector.page == 0 && (
        <Stack spacing={3}>
          <Tabs>
            <TabButton
              onClick={() => toggle(0)}
              className={tabOpen == 0 ? styles["tab-open"] : undefined}
            >
              Pending
            </TabButton>
            <TabButton
              onClick={() => toggle(1)}
              className={tabOpen == 1 ? styles["tab-open"] : undefined}
            >
              Ready
            </TabButton>
          </Tabs>

          {merged && merged.length > 0 && tabOpen == 0 && (
            <MiFutureContainer>
              {merged.filter(filterForPending).map((c: any) => (
                <>
                  <MiFutureCoin
                    key={c.coinid}
                    onClick={() => {
                      viewAndSetDetailsPage(c);
                    }}
                  >
                    <Stack direction="row">
                      <Avatar
                        sx={{
                          width: "48px",
                          height: "48px",
                          background: "#fff",
                        }}
                        className={styles["avatar"]}
                        variant="rounded"
                        src={`https://robohash.org/${c.tokenid}`}
                      />
                      <Stack flexDirection="column" alignItems="flex-start">
                        <MiCoinName>
                          {typeof c.token == "string" ? c.token : c.token.name}
                        </MiCoinName>

                        <MiCoinAmount>
                          {c.tokenid == "0x00" ? c.amount : c.tokenamount}
                        </MiCoinAmount>
                      </Stack>
                    </Stack>
                    <MiUnlockDate>
                      {c.state[2] ? (
                        <>
                          {moment(
                            new Decimal(c.state[2].data).toNumber()
                          ).format("MMM Do, YY")}{" "}
                          <br />
                          {moment(
                            new Decimal(c.state[2].data).toNumber()
                          ).format("H:mm A")}
                        </>
                      ) : (
                        "Unavailable"
                      )}
                    </MiUnlockDate>
                  </MiFutureCoin>
                </>
              ))}
            </MiFutureContainer>
          )}

          {merged && merged.length > 0 && tabOpen == 1 && (
            <MiFutureContainer>
              {merged.filter(filterForReady).map((c: any) => (
                <MiFutureCoin key={c.coinid}>
                  <Stack direction="row">
                    <Avatar
                      sx={{
                        width: "48px",
                        height: "48px",
                        background: "#fff",
                      }}
                      className={styles["avatar"]}
                      variant="rounded"
                      src={`https://robohash.org/${c.tokenid}`}
                    />
                    <Stack flexDirection="column" alignItems="flex-start">
                      <MiCoinName>
                        {typeof c.token == "string" ? c.token : c.token.name}
                      </MiCoinName>

                      <MiCoinAmount>
                        {c.tokenid == "0x00" ? c.amount : c.tokenamount}
                      </MiCoinAmount>
                    </Stack>
                  </Stack>
                  <Stack justifyContent="center">
                    <MiUnlockButton
                      disabled={c.status && c.status == "PENDING"}
                      onClick={async () => {
                        // dispatch a flag on the coin being collected.
                        dispatch(flagCoinCollection(c.coinid)); // flag this coin as being collected
                        dispatch(updatePendingStatus(true)); // there are pending collection coins in our balance

                        try {
                          await collectFutureCash({
                            coinid: c.coinid,
                            address: c.state[1].data,
                            tokenid: c.tokenid,
                            amount:
                              c.tokenid == "0x00"
                                ? c.amount
                                : c.tokenamount
                                ? c.tokenamount
                                : "0",
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
                  </Stack>
                </MiFutureCoin>
              ))}
            </MiFutureContainer>
          )}

          {!merged ||
            (merged.length === 0 && (
              <MiNoResults>
                <MiFutureNoResults />
                <Stack spacing={2} sx={{ m: 2 }}>
                  <MiNothingToSee>
                    Nothing to <br /> see here!
                  </MiNothingToSee>
                  <MiNothingToSeeSubtitle>
                    You currently have no <br /> pending contacts.
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
