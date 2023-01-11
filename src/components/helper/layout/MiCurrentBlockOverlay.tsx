import styled from "@emotion/styled";
import { Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  selectChainHeight,
  updateDisplayChainHeight,
} from "../../../redux/slices/minima/statusSlice";
import MiCard from "./MiCard";

const BackDrop = styled("div")`
  background: rgba(0, 0, 0, 0.6);
  height: 100vh;
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const MiCurrentBlockOverlay = () => {
  const currentHeight = useAppSelector(selectChainHeight);
  const dispatch = useAppDispatch();

  // console.log("displaying mi current");

  const handleOverlayDismiss = () => {
    dispatch(updateDisplayChainHeight(false));
  };

  return (
    <>
      <BackDrop onClick={handleOverlayDismiss}>
        <Stack
          justifyContent="center"
          sx={{ textAlign: "left", height: "100%", ml: 4, mr: 4, zIndex: 20 }}
        >
          <MiCard>Current Block: {currentHeight}</MiCard>
        </Stack>
      </BackDrop>
    </>
  );
};

export default MiCurrentBlockOverlay;
