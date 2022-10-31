import { Stack } from "@mui/material";
import MiWhiteOverlay from "../helper/layout/MiWhiteOverlay";
import MiFutureCashIcon from "../helper/layout/svgs/MiFutureCashIcon";
import MiFutureCashIconRight from "../helper/layout/svgs/MiFutureCashIconRight";

const SplashScreen = () => {
  return (
    <MiWhiteOverlay center={true}>
      <Stack
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <MiFutureCashIcon />
        <MiFutureCashIconRight />
      </Stack>
    </MiWhiteOverlay>
  );
};

export default SplashScreen;
