import { Navigate } from "react-router-dom";
import App from "../App";
import CoinDetails from "../components/futurecoins/coindetails/CoinDetails";
import FutureCoins from "../components/pages/future/FutureCoins";
import Instructions from "../components/pages/instructions/Instructions";
import Intro from "../components/pages/intro/Intro";
import Menu from "../components/pages/menu/Menu";
import Send from "../components/pages/send/Send";
import SmartContract from "../components/pages/smartcontract/SmartContract";
import Wallet from "../components/pages/wallet/Wallet";

const Routes = [
  {
    path: "/wallet",
    bottomnavName: "Balance",
    element: <Wallet />,
  },
  {
    path: "/send",
    bottomnavName: "Send",
    element: <Send />,
  },
  {
    path: "/future",
    bottomnavName: "Future",
    children: [
      {
        element: <FutureCoins />,
        index: true,
      },
      {
        path: "coindetails",
        element: <CoinDetails />,
      },
    ],
  },
  {
    path: "/instructions",
    element: <Instructions />,
  },
  {
    path: "/smartcontract",
    element: <SmartContract />,
  },
  {
    path: "*",
    element: <Navigate replace to="/send" />,
  },
];

export default Routes;
