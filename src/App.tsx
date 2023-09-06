import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import "./App.css";
import * as utils from "./utils";

function App() {
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const ls = localStorage.getItem(utils.getAppUID());
    if (!load) {
      setLoad(true);
      if (!ls) {
        return localStorage.setItem(utils.getAppUID(), "1");
      }
      if (ls) {
        navigate("/dashboard/send");
      }
    }
  }, [navigate, load]);

  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
