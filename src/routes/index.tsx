import { Navigate } from "react-router-dom";
import App from "../App";
import FutureCoins from "../components/pages/future/FutureCoins";
import Send from "../components/pages/send/Send";
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
    element: <FutureCoins />,
  },
  {
    path: "*",
    element: <Navigate replace to="/send" />,
  },
];

export default Routes;
