import React from "react";
import { Stack } from "@mui/material";
import MiFutureCashIcon from "../../helper/layout/svgs/MiFutureCashIcon";
import MiFutureCashIconRight from "../../helper/layout/svgs/MiFutureCashIconRight";

const SplashScreen = () => {
  return (
    <Stack
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <MiFutureCashIcon />
      <MiFutureCashIconRight />
    </Stack>
  );
};

export default SplashScreen;
