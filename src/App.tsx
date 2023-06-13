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

import { Stack } from "@mui/material";
import MiNavigation from "./components/helper/layout/MiNavigation";
import Intro from "./components/pages/intro/Intro";
import { selectPageSelector } from "./redux/slices/app/introSlice";
import MiCurrentBlockOverlay from "./components/helper/layout/MiCurrentBlockOverlay";
import { selectMenuStateStatus } from "./redux/slices/app/menuSlice";

import Menu from "./components/pages/menu/Menu";
import { NoResults } from "./components/helper/layout/MiToken";
import Unavailable from "./components/Unavailable";
import Grid from "./components/Grid";

import * as utils from "./utils";
import useIsMinimaBrowser from "./hooks/useIsMinimaBrowser";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const routes = useRoutes(Routes);
  const [minimaStarted, setMinimaStarted] = React.useState(false);
  const [MDSStatus, setMDSStatus] = React.useState(true);

  const displayChainHeightComponent = useAppSelector(selectDisplayChainHeight);
  const selectMenuStatus = useAppSelector(selectMenuStateStatus);
  const [firstTime, setFirstTime] = React.useState(true);
  const introPage = useAppSelector(selectPageSelector);

  const openTitleBar = useIsMinimaBrowser();

  React.useEffect(() => {
    const ls = localStorage.getItem(utils.getAppUID());

    if (!ls) {
      return localStorage.setItem(utils.getAppUID(), "1");
    }

    if (ls) {
      setFirstTime(false);
      navigate("/send");
    }
  }, []);

  React.useEffect(() => {
    events.onFail(() => {
      console.log("Failed!");
      setMDSStatus(false);
    });
    events.onInit(async () => {
      setMinimaStarted(true);
      dispatch(callAndStoreChainHeight());
      dispatch(callAndStoreCoins());
      dispatch(callAndStoreWalletBalance());
      dispatch(getFlaggedCoins());
      await addFutureCashScript(futureCashScript, false);
    });

    events.onNewBlock(() => {
      dispatch(callAndStoreChainHeight());
      dispatch(onNewBlock());
    });

    events.onNewBalance(() => {
      dispatch(callAndStoreCoins());
      dispatch(callAndStoreWalletBalance());
    });
  }, [dispatch]);

  return (
    <>
      {!MDSStatus && (
        <Unavailable>
          <Stack spacing={1} alignItems="center">
            <img src="./assets/failed.svg" />
            <Stack>
              <NoResults>
                <h6>MDS Unavailable</h6>
                <p>
                  Make sure you are logged into your MDS hub. Refresh this page
                  and try again.
                </p>
              </NoResults>
            </Stack>
          </Stack>
        </Unavailable>
      )}

      {MDSStatus && (
        <>
          {displayChainHeightComponent ? <MiCurrentBlockOverlay /> : null}

          {!!firstTime && introPage !== -1 && <Intro />}

          {!(firstTime && introPage !== -1) && (
            <div className="App">
              <div className="App-wrapper">
                {!!selectMenuStatus && <Menu />}
                <Grid
                  header={
                    <div onClick={openTitleBar} className="header">
                      <img alt="icon" src="./assets/icon.svg" />
                    </div>
                  }
                  content={
                    <>
                      {!!minimaStarted && routes}
                      {!minimaStarted && (
                        <NoResults>
                          <h6>Minima is offline</h6>
                          <p>check your node status, or refresh this page.</p>
                        </NoResults>
                      )}
                    </>
                  }
                  footer={<MiNavigation />}
                />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default App;
