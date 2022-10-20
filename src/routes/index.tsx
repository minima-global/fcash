import { Navigate } from "react-router-dom";
import App from "../App";
import FutureCoins from "../components/pages/FutureCoins";
import Send from "../components/pages/Send";
import Wallet from "../components/pages/Wallet";

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
