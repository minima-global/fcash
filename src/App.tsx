import "./App.css";
import React from "react";

import Routes from "./routes";
import { useRoutes } from "react-router-dom";

import { useAppDispatch } from "./redux/hooks";
import { showToast } from "./redux/slices/app/toastSlice";

import { callAndStoreCoins } from "./redux/slices/minima/coinSlice";
import { callAndStoreWalletBalance } from "./redux/slices/minima/balanceSlice";
import { events } from "./minima/libs/events";
import { addFutureCashScript } from "./minima/rpc-commands";
import { futureCashScript } from "./minima/scripts";
import { callAndStoreChainHeight } from "./redux/slices/minima/statusSlice";

import MiHeader from "./components/MiHeader";
import MiNavigation from "./components/MiNavigation";

function App() {
  const dispatch = useAppDispatch();
  const routes = useRoutes(Routes);

  const [minimaStarted, setMinimaStarted] = React.useState(false);

  React.useEffect(() => {
    events.onInit(() => {
      console.log("Minima inited");
      setMinimaStarted(true);
      dispatch(callAndStoreChainHeight());
      dispatch(callAndStoreCoins());
      dispatch(callAndStoreWalletBalance());
      addFutureCashScript(futureCashScript, false).then(() => {
        dispatch(showToast("FutureCash script added.", "info", ""));
      });
    });

    events.onNewBlock(() => {
      dispatch(callAndStoreChainHeight());
    });

    events.onNewBalance(() => {
      dispatch(callAndStoreCoins());
      dispatch(callAndStoreWalletBalance());
    });
  }, []);

  return (
    <div className="App">
      <div>
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
