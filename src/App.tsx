import "./App.css";
import React from "react";

import Routes from "./routes";
import { useRoutes } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { showToast } from "./redux/slices/app/toastSlice";

import {
  callAndStoreCoins,
  getFlaggedCoins,
} from "./redux/slices/minima/coinSlice";
import {
  callAndStoreWalletBalance,
  onNewBlock,
  selectBalance,
  selectBalanceNeedsUpdating,
} from "./redux/slices/minima/balanceSlice";
import { events } from "./minima/libs/events";
import { addFutureCashScript } from "./minima/rpc-commands";
import { futureCashScript } from "./minima/scripts";
import { callAndStoreChainHeight } from "./redux/slices/minima/statusSlice";

import MiHeader from "./components/helper/layout/MiHeader";
import MiNavigation from "./components/helper/layout/MiNavigation";

function App() {
  const dispatch = useAppDispatch();
  const routes = useRoutes(Routes);

  const [minimaStarted, setMinimaStarted] = React.useState(false);
  const sBalanceNeedsUpdating = useAppSelector<boolean>(
    selectBalanceNeedsUpdating
  );

  React.useEffect(() => {
    events.onInit(() => {
      console.log("Minima inited");
      setMinimaStarted(true);
      dispatch(callAndStoreChainHeight());
      dispatch(callAndStoreCoins());
      dispatch(callAndStoreWalletBalance());
      dispatch(getFlaggedCoins());
      addFutureCashScript(futureCashScript, false).then(() => {
        dispatch(showToast("FutureCash script added.", "info", ""));
      });
    });

    events.onNewBlock(() => {
      dispatch(callAndStoreChainHeight());
      dispatch(onNewBlock());
    });

    events.onNewBalance(() => {
      console.log(`new balance update`);
      dispatch(callAndStoreCoins());
      dispatch(callAndStoreWalletBalance());
    });
  }, [dispatch]);

  return (
    <div className="App">
      <div className="pb-50">
        <MiHeader />

        <div className="App-content">
          {minimaStarted ? <>{routes}</> : <div>not rendered</div>}
        </div>
      </div>

      <MiNavigation />
    </div>
  );
}

export default App;
