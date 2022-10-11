import React from "react";
import "./App.css";

import { useAppDispatch } from "./redux/hooks";
import { showToast } from "./redux/slices/app/toastSlice";
import { callAndStoreCoins } from "./redux/slices/minima/coinSlice";

import { callAndStoreWalletBalance } from "./redux/slices/minima/balanceSlice";
import { events } from "./minima/libs/events";
import FormFutureCash from "./components/forms/FormFutureCash";
import { addFutureCashScript } from "./minima/rpc-commands";
import { futureCashScript } from "./minima/scripts";
import FutureCoins from "./components/pages/FutureCoins";
import { callAndStoreChainHeight } from "./redux/slices/minima/statusSlice";

function App() {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    events.onInit(() => {
      console.log("Minima inited");
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
      <FormFutureCash />
      <FutureCoins />
    </div>
  );
}

export default App;
