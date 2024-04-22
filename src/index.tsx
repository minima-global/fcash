import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";

import { store as appStore } from "./redux/store";
import {
  Navigate,
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { CssBaseline } from "@mui/material";

import MiSnackBar from "./components/helper/layout/MiSnackBar";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { LocalizationProvider } from "@mui/x-date-pickers";
import AppProvider from "./AppContext";
import * as utils from "./utils";
import Send from "./components/pages/Send";
import SplashScreen from "./components/intro/SplashScreen";
import Dashboard from "./components/Dashboard";
import Wallet from "./components/pages/wallet/Wallet";
import Instructions from "./components/pages/instructions/Instructions";
import SmartContract from "./components/pages/smartcontract/SmartContract";
import Future from "./components/pages/Future";
import Intro from "./components/pages/intro/Intro";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createHashRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<App />}
      loader={() => {
        return localStorage.getItem(utils.getAppUID());
      }}
    >
      <Route index element={<SplashScreen />} />

      <Route path="introduction" element={<Intro />} />

      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Send />} />
        <Route path="send/:tokenid?" element={<Send />} />
        <Route path="future" element={<Future />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="instructions" element={<Instructions />} />
        <Route path="contract" element={<SmartContract />} />
        <Route path="smartcontract" element={<SmartContract />} />
        <Route
          path="*"
          element={<Navigate to="/dashboard/send" replace={false} />}
        />
      </Route>
    </Route>
  )
);

root.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <Provider store={appStore}>
          <CssBaseline />
          <AppProvider>
            <RouterProvider router={router} />
          </AppProvider>
          <MiSnackBar />
        </Provider>
      </ThemeProvider>
    </LocalizationProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
