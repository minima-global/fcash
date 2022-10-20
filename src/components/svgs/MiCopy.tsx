import { useAppDispatch } from "../../redux/hooks";
import { setClipboardStatus } from "../../redux/slices/app/clipboardSlice";
import { showToast } from "../../redux/slices/app/toastSlice";
import { copy } from "../../utils";
import styled from "@emotion/styled";

const CopyContainer = styled("h5")`
  margin: 0;
  padding: 0;
`;

const MiCopy = ({ size, color, copyPayload }: any) => {
  const dispatch = useAppDispatch();
  console.log("color", color);
  return (
    <CopyContainer
      onClick={() => {
        copy(copyPayload)
          .then(() => {
            dispatch(setClipboardStatus(true));
          })
          .catch((err) => {
            dispatch(showToast(err, "error", ""));
          });
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 25 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.01416 19.2354C7.61416 19.2354 7.26416 19.0854 6.96416 18.7854C6.66416 18.4854 6.51416 18.1354 6.51416 17.7354V3.73535C6.51416 3.33535 6.66416 2.98535 6.96416 2.68535C7.26416 2.38535 7.61416 2.23535 8.01416 2.23535H19.0142C19.4142 2.23535 19.7642 2.38535 20.0642 2.68535C20.3642 2.98535 20.5142 3.33535 20.5142 3.73535V17.7354C20.5142 18.1354 20.3642 18.4854 20.0642 18.7854C19.7642 19.0854 19.4142 19.2354 19.0142 19.2354H8.01416ZM8.01416 17.7354H19.0142V3.73535H8.01416V17.7354ZM5.01416 22.2354C4.61416 22.2354 4.26416 22.0854 3.96416 21.7854C3.66416 21.4854 3.51416 21.1354 3.51416 20.7354V5.66035H5.01416V20.7354H16.8642V22.2354H5.01416ZM8.01416 3.73535V17.7354V3.73535Z"
          fill={color}
        />
      </svg>
    </CopyContainer>
  );
};

export default MiCopy;
