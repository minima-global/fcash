import MiColoredOverlay from "../../helper/layout/MiColoredOverlay";
import MiPending from "../../helper/layout/svgs/MiPending";
import { MiHeader, MiContent } from "../../helper/layout/MiOverlay";
import { Button } from "@mui/material";
import { updatePage } from "../../../redux/slices/app/sendFormSlice";

const Pending = (props: any) => {
  const { page, resetForm, dispatch } = props;

  return (
    <MiColoredOverlay color="white">
      <MiPending />
      <MiHeader>
        Just one <br /> more thing
      </MiHeader>
      <MiContent>
        Your action is now pending. You can accept/deny this action in the
        pending transactions page. <br />
        If you are on desktop, you can type <code>mds action:pending</code> to
        list your pending transactions and then{" "}
        <code>mds action:accept/deny uid:actionId</code>.
      </MiContent>

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
    </MiColoredOverlay>
  );
};

export default Pending;
