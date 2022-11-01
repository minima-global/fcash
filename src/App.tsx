import "./App.css";
import React from "react";

import Routes from "./routes";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";

import { useAppDispatch } from "./redux/hooks";
import { showToast } from "./redux/slices/app/toastSlice";

import {
  callAndStoreCoins,
  getFlaggedCoins,
} from "./redux/slices/minima/coinSlice";
import {
  callAndStoreWalletBalance,
  onNewBlock,
} from "./redux/slices/minima/balanceSlice";
import { events } from "./minima/libs/events";
import { addFutureCashScript } from "./minima/rpc-commands";
import { futureCashScript } from "./minima/scripts";
import { callAndStoreChainHeight } from "./redux/slices/minima/statusSlice";

import MiHeader from "./components/helper/layout/MiHeader";
import MiNavigation from "./components/helper/layout/MiNavigation";
import Intro from "./components/pages/intro/Intro";
import SplashScreen from "./components/intro/SplashScreen";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const routes = useRoutes(Routes);

  const [splashScreen, showSplashScreen] = React.useState(true);

  const [minimaStarted, setMinimaStarted] = React.useState(false);
  const [firstTime, setFirstTime] = React.useState(true);

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

      setTimeout(() => showSplashScreen(false), 2500);
      firstTime ? navigate("intro") : navigate("/send");
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
      {splashScreen ? (
        <SplashScreen />
      ) : firstTime ? (
        <Intro />
      ) : (
        <>
          <div className="pb-50">
            {firstTime ? null : <MiHeader />}

            <div className="App-content">
              {minimaStarted ? <>{routes}</> : <div>not rendered</div>}
            </div>
          </div>
          {firstTime ? null : <MiNavigation />}
        </>
      )}
    </div>
  );
}

export default App;
