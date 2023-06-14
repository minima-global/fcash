import styles from "./styling/Grid.module.css";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  selectChainHeight,
  updateDisplayChainHeight,
} from "../../../redux/slices/minima/statusSlice";

const MiCurrentBlockOverlay = () => {
  const currentHeight = useAppSelector(selectChainHeight);
  const dispatch = useAppDispatch();

  const handleOverlayDismiss = () => {
    dispatch(updateDisplayChainHeight(false));
  };

  return (
    <>
      <div className={styles["backdrop"]} />
      <div onClick={handleOverlayDismiss} className={styles["grid"]}>
        <header />
        <main>
          <section>
            <div className={styles["current-height-wrapper"]}>
              Current block height: {currentHeight ? currentHeight : "N/A"}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default MiCurrentBlockOverlay;
