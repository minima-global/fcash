import { Alert, Snackbar } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";

import {
  hideToast,
  selectToastState,
  showToast,
} from "../../../redux/slices/app/toastSlice";

const MiSnackBar = () => {
  const state = useAppSelector(selectToastState);
  const dispatch = useAppDispatch();
  // console.log("MiSnackbar", state);
  return (
    <Snackbar
      open={state.display}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      key={Math.random() * 100000}
      className={state.props.type}
      autoHideDuration={3500}
      resumeHideDuration={3500 / 2}
      onClose={() => {
        dispatch(hideToast());
      }}
    >
      <Alert
        severity={
          state.props.severity && state.props.severity.length > 0
            ? state.props.severity
            : "info"
        }
        sx={{ width: "100%" }}
      >
        {state.props.message}
      </Alert>
    </Snackbar>
  );
};

export default MiSnackBar;
