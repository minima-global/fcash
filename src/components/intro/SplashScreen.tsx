import React from "react";
import { Stack } from "@mui/material";
import MiColoredOverlay from "../helper/layout/MiColoredOverlay";
import MiFutureCashIcon from "../helper/layout/svgs/MiFutureCashIcon";
import MiFutureCashIconRight from "../helper/layout/svgs/MiFutureCashIconRight";

const dataTestIds = {
  container: 'SplashScreen',
};

const SplashScreen = () => {
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <MiColoredOverlay color="splash" center={true}>
      <Stack
        data-testid={dataTestIds.container}
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <MiFutureCashIcon />
        <MiFutureCashIconRight />
      </Stack>
    </MiColoredOverlay>
  );
};

export default SplashScreen;
