import "./App.css";
import React from "react";

import Routes from "./routes";
import { useNavigate, useRoutes } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "./redux/hooks";
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
import {
  callAndStoreChainHeight,
  selectDisplayChainHeight,
} from "./redux/slices/minima/statusSlice";

import MiHeader from "./components/helper/layout/MiHeader";
import MiNavigation from "./components/helper/layout/MiNavigation";
import Intro from "./components/pages/intro/Intro";
import SplashScreen from "./components/intro/SplashScreen";
import { selectPageSelector } from "./redux/slices/app/introSlice";
import MiCurrentBlockOverlay from "./components/helper/layout/MiCurrentBlockOverlay";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const routes = useRoutes(Routes);

  const [splashScreen, showSplashScreen] = React.useState(true);

  const [minimaStarted, setMinimaStarted] = React.useState(false);
  const [firstTime, setFirstTime] = React.useState(true);

  const introPage = useAppSelector(selectPageSelector);
  const displayChainHeightComponent = useAppSelector(selectDisplayChainHeight);

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
      // TO-DO check if first time or switched off intro
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
      {displayChainHeightComponent ? <MiCurrentBlockOverlay /> : null}

      {splashScreen ? (
        <SplashScreen />
      ) : firstTime && introPage !== -1 ? (
        <Intro />
      ) : (
        <>
          <div className="pb-50">
            {firstTime && introPage !== -1 ? null : <MiHeader />}

            <div className="App-content">
              {minimaStarted ? <>{routes}</> : <div>not rendered</div>}
            </div>
          </div>
          {firstTime && introPage !== -1 ? null : <MiNavigation />}
        </>
      )}
    </div>
  );
}

export default App;
