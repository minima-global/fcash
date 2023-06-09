import { useEffect, useState } from "react";
import * as utils from "../utils";

const useFirstVisit = () => {
  const [firstTime, setFirstVisit] = useState(true);

  useEffect(() => {
    const firstTime = localStorage.getItem(utils.getAppUID());

    if (!firstTime) {
      return localStorage.setItem(utils.getAppUID(), "1");
    }

    if (firstTime) {
      setFirstVisit(false);
    }
  }, []);

  return firstTime;
};

export default useFirstVisit;
