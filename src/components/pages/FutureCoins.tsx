import { List, ListItem, ListItemText } from "@mui/material";
import { collectFutureCash } from "../../minima/rpc-commands";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectFutureCash } from "../../redux/slices/minima/coinSlice";

import { IFutureCashCollection } from "../../minima/types/app";
import { Coin } from "../../minima/types/minima";
import { showToast } from "../../redux/slices/app/toastSlice";
import { selectChainHeight } from "../../redux/slices/minima/statusSlice";
/**
 * 
 * interface IFutureCashCollection {
  coinid: string;
  address: string;
  tokenid: string;
  amount: string;
}
 */

const FutureCoins = () => {
  const coins = useAppSelector(selectFutureCash);
  const dispatch = useAppDispatch();
  const chainHeight = useAppSelector(selectChainHeight);

  return (
    <List>
      {coins && coins.length > 0 ? (
        coins.map((c: Coin) => (
          <ListItem
            sx={{
              cursor: "pointer",
              backgroundColor:
                c.tokenid !== "0x00" ? "rgba(255, 255, 255, 0.8)" : "",
              p: 2,
            }}
            onClick={async () => {
              if (chainHeight < parseInt(c.state[0].data)) {
                dispatch(showToast("Not ready yet!", "info", ""));

                return;
              }
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

                dispatch(showToast("Collected coins!", "success", ""));
              } catch (err: any) {
                console.error(err);
                dispatch(showToast(err, "error", ""));
              }
            }}
            key={c.coinid}
          >
            <ListItemText>{c.coinid}</ListItemText>
            <ListItemText>unlock time:{c.state[0].data}</ListItemText>
          </ListItem>
        ))
      ) : coins && coins.length === 0 ? (
        <div>No future yet</div>
      ) : null}
    </List>
  );
};

export default FutureCoins;
