import {
  createContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { Coin, IScript, MinimaToken } from "./minima/@types/minima";

import * as RPC from "./minima/commands";
import { makeTokenImage } from "./utils";
import { futureCashScript } from "./minima/scripts";

import * as utils from "./utils";

var balanceInterval: ReturnType<typeof setInterval>;
export const appContext = createContext({} as any);

interface IProps {
  children: any;
}
const AppProvider = ({ children }: IProps) => {
  const loaded = useRef(false);
  const [mode, setMode] = useState("desktop");

  /**  Minima Stuff  */
  const [wallet, setWallet] = useState<MinimaToken[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [tip, setTip] = useState<number | null>(null);

  const [displayMenu, setDisplayMenu] = useState(false);
  const [displayBlock, setDisplayBlock] = useState(false);

  const [vaultLocked, setVaultLocked] = useState<boolean | null>(null);

  useEffect(() => {
    if (window.innerWidth < 568) {
      setMode("mobile");
    }
  }, []);

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      (window as any).MDS.init((msg: any) => {
        if (msg.event === "inited") {
          // add future cash script
          // get block height
          (window as any).MDS.cmd("block", function (resp: any) {
            if (resp.status) {
              setTip(resp.response.block);
            }
          });
          // get coins
          getCoins();

          // get wallet balance
          getBalance();

          // check vault locked
          checkVaultLocked();
          // add future cash script
          MDS.cmd(
            `newscript trackall:false script:"RETURN (@BLOCK GTE PREVSTATE(1) OR @COINAGE GTE PREVSTATE(4)) AND VERIFYOUT(@INPUT PREVSTATE(2) @AMOUNT @TOKENID FALSE)"`,
            () => {}
          );
        }

        if (msg.event === "NEWBALANCE") {
          // get coins
          getCoins();
          // get wallet balance
          getBalance();
        }

        if (msg.event === "NEWBLOCK") {
          // get block height
          (window as any).MDS.cmd("block", function (resp: any) {
            if (resp.status) {
              setTip(resp.response.block);
            }
          });
          // on new block?
        }
      });
    }
  }, [loaded]);

  const getCoins = async () => {
    try {
      const futureCashContract = await new Promise((resolve, reject) => {
        (window as any).MDS.cmd("scripts", function(resp: any) {          
          if (!resp.status) reject("No response from server");

          const c = resp.response.find((c: IScript) => c.script === futureCashScript);
          resolve(c.address);
        })
      });

      const futureContracts: Coin[] = await new Promise((resolve, reject) => {
        (window as any).MDS.cmd("coins", function(resp: any) {
          if (!resp.status) reject("No response from server, cmd coins");
          let futures: Coin[] = [];
          resp.response.forEach((c: Coin) => {
            if (c.address === futureCashContract) {
              if (
                c.token &&
                c.token.name &&
                c.token.name.url &&
                c.token.name.url.startsWith("<artimage>", 0)
              ) {
                c.token.name.url = makeTokenImage(
                  c.token.name.url,
                  c.tokenid
                );
              }
              futures.push(c);
            }
          })
          resolve(futures);

        })
      })

      setCoins(futureContracts);

    } catch (error) {
      console.error('Failed to fetch Future contracts', error);
      setCoins([]);
    }
  };

  const getBalanceDefault = () => {
    (window as any).MDS.cmd("balance", (resp: any) => {
      if (resp.status) {
        const updatedTokens = resp.response.map((item: MinimaToken) => {
          utils.updateTokenUrl(item.token, item.tokenid);
          return item; // Make sure to return the item
        });
        setWallet(updatedTokens);
      }
    });
  };

  const getBalance = async () => {
    const tokens = await RPC.getTokens();
    await RPC.getMinimaBalance().then((b) => {
      b.map((t) => {
        if (t.token.url && t.token.url.startsWith("<artimage>", 0)) {
          t.token.url = makeTokenImage(t.token.url, t.tokenid);
        }
      });

      const walletNeedsUpdating = !!b.find((t) => t.unconfirmed !== "0");

      if (!walletNeedsUpdating) {
        window.clearInterval(balanceInterval);
      }

      if (walletNeedsUpdating) {
        setWallet(b);
        if (!balanceInterval) {
          balanceInterval = setInterval(() => {
            getBalance();
          }, 10000);
        }
      }

      const filterNonFungible = tokens.filter((t) => t.decimals === 0);
      const balanceWithoutNFT = b.filter(
        (t) => !filterNonFungible.some((f) => f.tokenid === t.tokenid)
      );

      setWallet(balanceWithoutNFT);
    });
  };

  const checkVaultLocked = () => {
    (window as any).MDS.cmd("status", (resp: any) => {
      if (resp.status) {
        setVaultLocked(resp.response.locked);
      }
    });
  };

  return (
    <appContext.Provider
      value={{
        loaded,
        mode,
        isMobile: mode === "mobile",

        // Minima Stuff
        wallet,
        coins,
        getCoins,
        getBalanceDefault,
        tip,
        vaultLocked,

        displayMenu,
        setDisplayMenu,

        displayBlock,
        setDisplayBlock,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export default AppProvider;
