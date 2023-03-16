import MiColoredOverlay from "../../../helper/layout/MiColoredOverlay";
import MiPending from "../../../helper/layout/svgs/MiPending";
import { MiHeader, MiContent } from "../../../helper/layout/MiOverlay";
import { Button, Stack } from "@mui/material";
import { updatePage } from "../../../../redux/slices/app/sendFormSlice";

import styles from "./Pending.module.css";

const Pending = (props: any) => {
  const { page, resetForm, dispatch } = props;

  return (
    <MiColoredOverlay color="white">
      <Stack spacing={5}>
        <Stack alignItems="center">
          <MiPending />
          <MiHeader>
            Just one <br /> more thing
          </MiHeader>
          <MiContent>
            Your transaction is now pending. <br />
            Click on the{" "}
            <img
              className={styles["pending-icon"]}
              src="./assets/pendingTransaction.svg"
            />{" "}
            icon from the Home page to accept the transaction. If on Desktop,
            select Pending Actions from your Minidapp hub.
          </MiContent>
        </Stack>

        <Button
          onClick={() => {
            resetForm();
            dispatch(updatePage(page - 3));
          }}
          color="secondary"
          fullWidth
          variant="contained"
        >
          Close
        </Button>
      </Stack>
    </MiColoredOverlay>
  );
};

export default Pending;
