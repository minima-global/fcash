import React from "react";
import { Stack } from "@mui/system";
import styled from "@emotion/styled";
import { Avatar } from "@mui/material";
import {
  MiCoinName,
  MiCoinAmount,
  MiUnlockDate,
  MiFutureCoin,
} from "../helper/layout/MiCoin";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectFutureCash } from "../../redux/slices/minima/coinSlice";
import { selectChainHeight } from "../../redux/slices/minima/statusSlice";
import { selectBalance } from "../../redux/slices/minima/balanceSlice";

import styles from "../styling/futurepage/index.module.css";
import moment from "moment";
import { mergeArray } from "../../utils";
import Decimal from "decimal.js";

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

const FutureCoins = () => {
  const coins = useAppSelector(selectFutureCash);
  const walletTokens = useAppSelector(selectBalance);

  const merged = mergeArray(coins, walletTokens);
  console.log(merged);
  const [tabOpen, setTabOpenIndex] = React.useState(0);
  const toggle = (i: number) => setTabOpenIndex(i);

  return (
    <>
      <Stack spacing={2}>
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

        <MiFutureContainer>
          {merged && merged.length > 0
            ? merged.map((c: any) => (
                <MiFutureCoin>
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
                        {moment(new Decimal(c.state[2].data).toNumber()).format(
                          "MMM Do, YY"
                        )}{" "}
                        <br />
                        {moment(new Decimal(c.state[2].data).toNumber()).format(
                          "H:mm A"
                        )}
                      </>
                    ) : (
                      "Unavailable"
                    )}
                  </MiUnlockDate>
                </MiFutureCoin>
              ))
            : null}
        </MiFutureContainer>
      </Stack>
    </>
    // <List>
    //   {coins && coins.length > 0 ? (
    //     coins.map((c: Coin) => (
    //       <ListItem
    //         sx={{
    //           cursor: "pointer",
    //           backgroundColor:
    //             c.tokenid !== "0x00" ? "rgba(255, 255, 255, 0.8)" : "",
    //           p: 2,
    //         }}
    //         onClick={async () => {
    //           if (chainHeight < parseInt(c.state[0].data)) {
    //             dispatch(showToast("Not ready yet!", "info", ""));

    //             return;
    //           }
    //           try {
    //             await collectFutureCash({
    //               coinid: c.coinid,
    //               address: c.state[1].data,
    //               tokenid: c.tokenid,
    //               amount:
    //                 c.tokenid == "0x00"
    //                   ? c.amount
    //                   : c.tokenamount
    //                   ? c.tokenamount
    //                   : "0",
    //             });

    //             dispatch(showToast("Collected coins!", "success", ""));
    //           } catch (err: any) {
    //             console.error(err);
    //             dispatch(showToast(err, "error", ""));
    //           }
    //         }}
    //         key={c.coinid}
    //       >
    //         <ListItemText>{c.coinid}</ListItemText>
    //         <ListItemText>unlock time:{c.state[0].data}</ListItemText>
    //       </ListItem>
    //     ))
    //   ) : coins && coins.length === 0 ? (
    //     <div>No future yet</div>
    //   ) : null}
    // </List>
  );
};

export default FutureCoins;
