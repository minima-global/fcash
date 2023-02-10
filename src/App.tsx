import "./App.css";
import React from "react";

import Routes from "./routes";
import { useNavigate, useRoutes } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "./redux/hooks";

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

import { Grid } from "@mui/material";
import MiNavigation from "./components/helper/layout/MiNavigation";
import Intro from "./components/pages/intro/Intro";
import SplashScreen from "./components/intro/SplashScreen";
import {
  checkIfFirstTime,
  selectFirstTime,
  selectPageSelector,
} from "./redux/slices/app/introSlice";
import MiCurrentBlockOverlay from "./components/helper/layout/MiCurrentBlockOverlay";
import { selectMenuStateStatus } from "./redux/slices/app/menuSlice";

import Menu from "./components/pages/menu/Menu";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const routes = useRoutes(Routes);

  const [splashScreen, showSplashScreen] = React.useState(true);
  const [minimaStarted, setMinimaStarted] = React.useState(false);

  const introPage = useAppSelector(selectPageSelector);
  const displayChainHeightComponent = useAppSelector(selectDisplayChainHeight);
  const selectMenuStatus = useAppSelector(selectMenuStateStatus);

  const firstTime = useAppSelector(selectFirstTime);

  React.useEffect(() => {
    events.onInit(async () => {
      setMinimaStarted(true);
      dispatch(callAndStoreChainHeight());
      dispatch(callAndStoreCoins());
      dispatch(callAndStoreWalletBalance());
      dispatch(getFlaggedCoins());
      dispatch(checkIfFirstTime());
      setTimeout(() => showSplashScreen(false), 2500);
      // TO-DO check if first time or switched off intro
      try {
        await addFutureCashScript(futureCashScript, false);
      } catch (error) {
        // console.error(error);
      }
      firstTime ? navigate("intro") : navigate("/send");
    });

    events.onNewBlock(() => {
      dispatch(callAndStoreChainHeight());
      dispatch(onNewBlock());
    });

    events.onNewBalance(() => {
      // console.log(`new balance update`);
      dispatch(callAndStoreCoins());
      dispatch(callAndStoreWalletBalance());
    });
  }, [dispatch]);

  return (
    <>
      {displayChainHeightComponent ? <MiCurrentBlockOverlay /> : null}

      {splashScreen ? (
        <Grid container>
          <Grid item xs={0} sm={2} />
          <Grid item xs={12} sm={8}>
            <SplashScreen />
          </Grid>
          <Grid item xs={0} sm={2} />
        </Grid>
      ) : firstTime && introPage !== -1 ? (
        <Grid container>
          <Grid item xs={0} sm={2} />
          <Grid item xs={12} sm={8}>
            <Intro />
          </Grid>
          <Grid item xs={0} sm={2} />
        </Grid>
      ) : (
        <>
          {/* the rest of the app */}
          <div className="App">
            <div className="pb-50">
              {/* {firstTime && introPage !== -1 ? null : <MiHeader />} */}
              {selectMenuStatus ? <Menu /> : null}
              <div className="App-content">
                {minimaStarted ? (
                  <>
                    <Grid container>
                      <Grid item xs={0} sm={2} />
                      <Grid item xs={12} sm={8}>
                        {routes}
                      </Grid>
                      <Grid item xs={0} sm={2} />
                    </Grid>
                  </>
                ) : (
                  <div>not rendered</div>
                )}
              </div>
            </div>
            {firstTime && introPage !== -1 ? null : <MiNavigation />}
          </div>
        </>
      )}
    </>
  );
}

export default App;
